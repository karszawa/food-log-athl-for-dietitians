import Constants from "expo-constants";
import { sha256 } from "js-sha256";
import { Dayjs } from "dayjs";
import { NotAuthenticatedError, BadRequest, InvalidRequest } from "./error";
import {
  Auth,
  PostSessionResponse,
  GetRecordsFoodsResponse,
  GetDietitiansResponse,
  GetRecordsDailyResponse,
  GetRecordsPhotosIdSignResponse,
} from "./foolog-api-client.d";

const { SECRET_KEY, APP_ID, BASE_URL } = Constants.manifest.extra;
const [GET, POST, PUT, DELETE] = ["GET", "POST", "PUT", "DELETE"];

function qs(props: { [key: string]: any }) {
  return Object.entries(props)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
}

function logging(method: string, path: string): Function {
  return function(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (descriptor.value) {
      const original = descriptor.value;

      descriptor.value = async function(...args: any[]) {
        console.log(`\x1b[44m${method}: ${path}\x1b[0m`);
        const result = await original.apply(this, args);
        console.log(`\x1b[36m=> ${JSON.stringify(result)}\x1b[0m`);
        return result;
      };
    }
  };
}

type Headers = {
  [name: string]: string;
};

export class FooLogAPIClient {
  static platform = "iOS";
  static deviceId = sha256.hmac(SECRET_KEY, Constants.deviceId);
  static auth?: Auth;

  static async fetch(
    url: string,
    {
      method,
      headers,
      body,
    }: { method: string; headers?: Headers; body?: string }
  ): Promise<Response> {
    if (!this.auth) {
      throw new NotAuthenticatedError();
    }

    if (this.auth.expiry_time.getTime() < Date.now()) {
      await this.postDietitiansSession({
        username: this.auth.username,
        password: this.auth.password,
      });
    }

    const date = new Date().toUTCString();
    const data = `${method}&${date}&${url}`;
    const signature = sha256.hmac(this.auth.token_secret, data);
    const token = `Token token="${this.auth.token}",signature="${signature}"`;

    return fetch(url, {
      method,
      headers: {
        ...(headers || {}),
        Date: date,
        Authorization: token,
      },
      body,
    });
  }

  // API0101
  @logging(POST, "/dietitians/session")
  static async postDietitiansSession({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const response = await fetch(`${BASE_URL}/dietitians/session`, {
      method: POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api: {
          login_id: username,
          password,
        },
        app_id: APP_ID,
        device_id: this.deviceId,
        platform: this.platform,
      }),
    });

    const data: PostSessionResponse = await response.json();

    switch (response.status) {
      case 201:
        this.auth = {
          username,
          password,
          token: data.token,
          token_secret: data.token_secret,
          expiry_time: new Date(data.expiry_time),
          refresh_token: data.refresh_token,
          refresh_token_secret: data.refresh_token_secret,
          refresh_token_expiry_time: new Date(data.refresh_token_expiry_time),
        };
        return Boolean(this.auth);
      case 400:
        throw new BadRequest(data.error.error_code);
      case 401:
        throw new BadRequest(data.error.error_code);
      case 422:
        throw new InvalidRequest(data.error.error_code);
      default:
        throw new InvalidRequest();
    }
  }

  // API0102
  @logging(DELETE, "/session")
  static async deleteSession() {
    const response = await this.fetch(`${BASE_URL}/session`, {
      method: DELETE,
    });
    const data = await response.json();

    switch (response.status) {
      case 200:
        this.auth = null;
        return data;
      default:
        throw new InvalidRequest();
    }
  }

  // API0103
  // async postSessionRefresh() {}

  // API1006
  @logging(GET, "/records/photos/:id/sign")
  static async getRecordsPhotosIdSign(props: {
    athleteId: string;
    id: string;
    size: "S" | "M" | "L";
  }): Promise<GetRecordsPhotosIdSignResponse> {
    const { id, athleteId, size } = props;
    const response = await this.fetch(
      `${BASE_URL}/records/photos/${id}/${size}/sign`,
      {
        method: GET,
        headers: {
          "X-User-Id": athleteId,
        },
      }
    );

    const data: GetRecordsPhotosIdSignResponse = await response.json();

    switch (response.status) {
      case 200:
        return data;
      case 400:
        throw new InvalidRequest(data.error.error_code);
      default:
        throw new BadRequest(data.error.error_code);
    }
  }
  // GetRecordsPhotosIdSignResponse

  // API1012
  @logging(GET, "/records/foods")
  static async getRecordsFoods(props: {
    athleteId: string;
    offset?: number;
    limit?: number;
    from: string;
    to: string;
    include_deleted?: boolean;
    detail?: boolean;
    expiry_sec?: number;
    size?: string;
  }): Promise<GetRecordsFoodsResponse> {
    const params = {
      offset: 0,
      limit: 200,
      include_deleted: false,
      detail: false,
      size: "M",
      ...props,
    };

    const response = await this.fetch(
      `${BASE_URL}/records/foods?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );

    const data: GetRecordsFoodsResponse = await response.json();

    switch (response.status) {
      case 200:
        return data;
      case 400:
        throw new InvalidRequest(data.error.error_code);
      default:
        throw new InvalidRequest(JSON.stringify(data));
    }
  }

  // API5201
  @logging(GET, "/records/daily")
  static async getRecordsDaily(props: {
    athleteId: string;
    from: Dayjs;
    to: Dayjs;
    food: boolean;
    latest: boolean;
  }): Promise<GetRecordsDailyResponse> {
    const params = {
      ...props,
      expiry_sec: 900,
      from: props.from.format("YYYY-MM-DD"),
      to: props.to.format("YYYY-MM-DD"),
    };

    const response = await this.fetch(
      `${BASE_URL}/records/daily?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );
    const data: GetRecordsDailyResponse = await response.json();

    switch (response.status) {
      case 200:
        return data;
      case 400:
        throw new BadRequest(data.error.error_code);
    }
  }

  // API7202
  @logging(GET, "/dietitians")
  static async getDietitians(): Promise<GetDietitiansResponse> {
    const response = await this.fetch(`${BASE_URL}/dietitians`, {
      method: GET,
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        return data;
      case 400:
        throw new BadRequest(data.error.error_code);
    }
  }
}
