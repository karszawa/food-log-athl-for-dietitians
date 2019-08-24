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
  GetUserNutritionAmountResponse,
  DateString,
  GetRecordsBodyResponse,
  ResponseData,
  DeleteSessionResponse,
  GetRecordsFoodsIdResponse,
} from "./foolog-api-client-types";

const { SECRET_KEY, APP_ID, BASE_URL } = Constants.manifest.extra;
const [GET, POST, DELETE] = ["GET", "POST", "DELETE"];

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

  static async fetch<T extends ResponseData>(
    url: string,
    {
      method,
      headers,
      body,
    }: { method: string; headers?: Headers; body?: string }
  ): Promise<T> {
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
    const key = `${method}&${date}&${url}`;
    const signature = sha256.hmac(this.auth.token_secret, key);
    const token = `Token token="${this.auth.token}",signature="${signature}"`;

    const response = await fetch(url, {
      method,
      headers: {
        ...(headers || {}),
        Date: date,
        Authorization: token,
      },
      body,
    });

    const result: T = await response.json();

    if (!response.ok) {
      console.log(result);
      throw new BadRequest(result.error.error_code);
    }

    return result;
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
    const data = await this.fetch<DeleteSessionResponse>(
      `${BASE_URL}/session`,
      {
        method: DELETE,
      }
    );

    this.auth = null;

    return data;
  }

  // API0103
  @logging(GET, "/user/nutrition/amount")
  static getUserNutritionAmount(props: {
    athleteId: string;
    offset?: number;
    limit?: number;
  }) {
    const params = {
      offset: props.offset || 0,
      limit: props.limit || 1000,
    };

    return this.fetch<GetUserNutritionAmountResponse>(
      `${BASE_URL}/user/nutrition/amount?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );
  }

  // API1006
  @logging(GET, "/records/photos/:id/sign")
  static getRecordsPhotosIdSign(props: {
    athleteId: string;
    id: string;
    size: "S" | "M" | "L";
  }) {
    const { id, athleteId, size } = props;
    return this.fetch<GetRecordsPhotosIdSignResponse>(
      `${BASE_URL}/records/photos/${id}/${size}/sign`,
      {
        method: GET,
        headers: {
          "X-User-Id": athleteId,
        },
      }
    );
  }

  // API1012
  @logging(GET, "/records/foods")
  static getRecordsFoods(props: {
    athleteId: string;
    offset?: number;
    limit?: number;
    from: string;
    to: string;
    include_deleted?: boolean;
    detail?: boolean;
    expiry_sec?: number;
    size?: string;
  }) {
    const params = {
      offset: 0,
      limit: 200,
      include_deleted: false,
      detail: false,
      size: "M",
      ...props,
    };

    return this.fetch<GetRecordsFoodsResponse>(
      `${BASE_URL}/records/foods?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );
  }

  // API1013
  @logging(GET, "/records/foods/:id")
  static getRecordsFoodsId(props: { athleteId: string; recordId: string }) {
    const { athleteId, recordId } = props;
    const params = {
      size: "M",
      expiry_sec: 900,
    };

    return this.fetch<GetRecordsFoodsIdResponse>(
      `${BASE_URL}/records/foods/${recordId}?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": athleteId,
        },
      }
    );
  }

  // API2202
  @logging(GET, "/records/body")
  static getRecordsBody(props: {
    athleteId: string;
    offset?: number;
    limit?: number;
    from: DateString;
    to: DateString;
    sort?: 0 | 1;
    include_deleted?: boolean;
  }) {
    const params = {
      offset: props.offset | 0,
      limit: props.limit | 200,
      sort: props.sort | 0,
      include_deleted: props.include_deleted || false,
      from: props.from,
      to: props.to,
    };

    return this.fetch<GetRecordsBodyResponse>(
      `${BASE_URL}/records/body?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );
  }

  // API5201
  @logging(GET, "/records/daily")
  static getRecordsDaily(props: {
    athleteId: string;
    from: Dayjs;
    to: Dayjs;
    food: boolean;
    latest: boolean;
    expiry_sec?: number;
    size?: "S" | "M" | "L";
  }) {
    const params = {
      ...props,
      expiry_sec: 900,
      size: "S",
      from: props.from.format("YYYY-MM-DD"),
      to: props.to.format("YYYY-MM-DD"),
    };

    console.log(params);

    return this.fetch<GetRecordsDailyResponse>(
      `${BASE_URL}/records/daily?${qs(params)}`,
      {
        method: GET,
        headers: {
          "X-User-Id": props.athleteId,
        },
      }
    );
  }

  // API7202
  @logging(GET, "/dietitians")
  static getDietitians() {
    return this.fetch<GetDietitiansResponse>(`${BASE_URL}/dietitians`, {
      method: GET,
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
  }
}
