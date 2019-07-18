import { createAction } from "redux-starter-kit";

export const SESSION_ERROR = "SESSION_ERROR";

export interface SessionErrorPayload {
  code: string;
}

export const sessionError = createAction<SessionErrorPayload>(SESSION_ERROR);

export const TRY_SIGN_IN = "TRY_SIGN_IN";

interface TrySignInPayload {
  username: string;
  password: string;
}

export const signIn = createAction<TrySignInPayload>(TRY_SIGN_IN);

export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";

export interface SignInSuccessPayload {
  username: string;
  password: string;
}

export const signInSuccess = createAction<SignInSuccessPayload>(
  SIGN_IN_SUCCESS
);

const SIGN_IN_FAILED = "SIGN_IN_FAILED";

export interface SignInFailedPayload {
  username?: string;
  password?: string;
  overall: string;
}

export const signInFailed = createAction<SignInFailedPayload>(SIGN_IN_FAILED);

const SIGN_OUT = "SIGN_OUT";

export interface SignOutPayload {}

export const signOut = createAction<SignOutPayload>(SIGN_OUT);

export const RESTORE_SESSION = "RESTORE_SESSION";

export interface RestoreSessionPayload {}

export const restoreSession = createAction<RestoreSessionPayload>(
  RESTORE_SESSION
);
