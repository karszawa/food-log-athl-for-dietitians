export const BASE_ERROR_CODE = "BASE_ERROR_CODE";
export const NOT_AUTHENTICATED_ERROR = "NOT_AUTHENTICATED_ERROR";

export class BaseError extends Error {
  type = BASE_ERROR_CODE;
}

export function extendsBaseError(e: any): e is BaseError {
  return Boolean(e.type);
}

export class NotAuthenticatedError extends BaseError {
  type = NOT_AUTHENTICATED_ERROR;
}

export function isNotAuthenticatedError(e: any): e is NotAuthenticatedError {
  return e.type === NOT_AUTHENTICATED_ERROR;
}

export const REQUEST_ERROR_TYPE = "REQUEST_ERROR_TYPE";

export class RequestError extends BaseError {
  type = REQUEST_ERROR_TYPE;
  code = "000";
}

export function extendsRequestError(e: any): e is RequestError {
  return Boolean(e.code);
}

export const BAD_REQUEST_TYPE = "BAD_REQUEST_TYPE";

export class BadRequest extends RequestError {
  type = BAD_REQUEST_TYPE;
  code: string;

  constructor(code: string = "unknown") {
    super();
    this.code = code;
  }
}

export function isBadRequest(e: any): e is BadRequest {
  return e.type === BAD_REQUEST_TYPE;
}

export const INVALID_REQUEST_TYPE = "INVALID_REQUEST_TYPE";

export class InvalidRequest extends RequestError {
  type = INVALID_REQUEST_TYPE;
  code: string;

  constructor(code: string = "unknown") {
    super();
    this.code = code;
  }
}

export function isInvalidRequest(e: any): e is InvalidRequest {
  return e.type === INVALID_REQUEST_TYPE;
}
