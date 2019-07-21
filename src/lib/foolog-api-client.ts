import Constants from "expo-constants";
import { sha256 } from "js-sha256";
import { NotAuthenticatedError, BadRequest, InvalidRequest } from "./error";
import { Auth, PostSessionResponseData } from "./foodlog-api-client";

const { SECRET_KEY, APP_ID, BASE_URL } = Constants.manifest.extra;
const [GET, POST, PUT, DELETE] = ["GET", "POST", "PUT", "DELETE"];

function logging(method: string, path: string): Function {
  return function(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (descriptor.value) {
      const original = descriptor.value;

      descriptor.value = function(...args: any[]) {
        console.log(`\x1b[44m${method}: ${path}\x1b[0m`);
        const result = original.apply(this, args);
        console.log(`\x1b[36m=> ${JSON.stringify(result)}\x1b[0m`);
      };
    }
  };
}

export default class FooLogAPIClient {
  static platform = "iOS";
  static deviceId = sha256.hmac(SECRET_KEY, Constants.deviceId);
  static auth?: Auth;

  static async authenticate(request: Request): Promise<Request> {
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
    const data = `${request.method}&${date}&${request.url}`;
    const signature = sha256.hmac(this.auth.token_secret, data);
    const token = `Token token="${this.auth.token}",signature="${signature}"`;

    request.headers["X-Date"] = date;
    request.headers["Authorization"] = token;

    return request;
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
      method: "POST",
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

    const data: PostSessionResponseData = await response.json();

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
    const request = await this.authenticate(
      new Request(`${BASE_URL}/session`, { method: "DELETE" })
    );

    const response = await fetch(request);
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

  // API7202
  @logging(GET, "/dietitians")
  static async getDietitians() {
    const response = await fetch(
      await this.authenticate(
        new Request(`${BASE_URL}/dietitians`, {
          method: "GET",
        })
      )
    );

    const data = await response.json();

    switch (response.status) {
      case 200:
        return data;
      case 400:
        throw new BadRequest(data.error.error_code);
    }
  }
}
