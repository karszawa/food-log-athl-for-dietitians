export const BASE_ERROR_CODE = "BASE_ERROR_CODE";
export const NOT_AUTHENTICATED_ERROR = "NOT_AUTHENTICATED_ERROR";

export class BaseError extends Error {
  code = BASE_ERROR_CODE;
}

export class NotAuthenticatedError extends BaseError {
  code = NOT_AUTHENTICATED_ERROR;
}

export class BadRequest extends BaseError {
  type = "bad-request";
  code: string;

  constructor(code: string = "unknown") {
    super();
    this.code = code;
  }
}

export class InvalidRequest extends BaseError {
  type = "invalid-request";
  code: string;

  constructor(code: string = "unknown") {
    super();
    this.code = code;
  }
}
