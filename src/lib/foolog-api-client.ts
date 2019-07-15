import Constants from "expo-constants";
import { sha256 } from "js-sha256";
import { BASE_URL, APP_ID } from "../constants";
import { NotAuthenticatedError, BadRequest, InvalidRequest } from "./error";

type Auth = {
  username: string;
  password: string;
  token: string;
  token_secret: string;
  expiry_time: Date;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: Date;
};

interface ResponseData {
  error: {
    error_code: string;
  };
}

interface PostSessionResponseData extends ResponseData {
  token: string;
  token_secret: string;
  expiry_time: string;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: string;
}

export default class FooLogAPIClient {
  static platform = "iOS";
  static deviceId = sha256(Constants.deviceId);
  static auth?: Auth;

  static async authenticate(request: Request): Promise<Request> {
    if (!this.auth) {
      throw new NotAuthenticatedError();
    }

    if (this.auth.expiry_time.getTime() < Date.now()) {
      await this.postSession({
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
  static async postSession({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const response = await fetch(`${BASE_URL}/session`, {
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
}
