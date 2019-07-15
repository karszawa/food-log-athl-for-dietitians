import * as SecureStore from "expo-secure-store";
import { createSlice, PayloadAction, createAction } from "redux-starter-kit";
import { call, put, fork, takeEvery } from "redux-saga/effects";
import FooLogAPIClient from "../lib/foolog-api-client";
import { extendsRequestError, RequestError } from "../lib/error";

export interface State {
  username: string;
  password: string;
  authenticated: boolean;
  processing: boolean;
  errors?: { [key in "username" | "password"]?: string };
}

const initialState: State = {
  username: "",
  password: "",
  authenticated: false,
  processing: false,
};

interface AuthenticatePayload {
  username: string;
  password: string;
}

interface SetErrorPayload {
  username?: string;
  password?: string;
}

const slice = createSlice({
  initialState,
  reducers: {
    signOut(state: State) {
      state.username = "";
      state.password = "";
    },
    authenticate(state: State, action: PayloadAction<AuthenticatePayload>) {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.authenticated = true;
    },
    startFetch(state: State) {
      state.processing = true;
    },
    finishFetch(state: State) {
      state.processing = false;
    },
    setError(state: State, action: PayloadAction<SetErrorPayload>) {
      state.errors.username = action.payload.username;
      state.errors.password = action.payload.password;
    },
  },
});

export const {
  signOut,
  authenticate,
  startFetch,
  finishFetch,
  setError,
} = slice.actions;

// ----------------------------------[Sagas]----------------------------------

export const SIGN_IN = "SIGN_IN";

interface SignInPayload {
  username: string;
  password: string;
}

export const signIn = createAction<SignInPayload>(SIGN_IN);

function* handleSignIn(action: PayloadAction<SignInPayload>) {
  try {
    yield put(startFetch());
    yield call(FooLogAPIClient.postSession, action.payload);
    yield put(authenticate(action.payload));
  } catch (e) {
    if (extendsRequestError(e)) {
      yield fork(handleSessionError, sessionError(e));
    } else {
      throw e;
    }
  } finally {
    yield put(finishFetch());
  }
}

export const RESTORE_SESSION = "RESTORE_SESSION";

interface RestoreSessionPayload {}

export const restoreSession = createAction<RestoreSessionPayload>(
  RESTORE_SESSION
);

function* handleRestoreSession() {
  const username = yield call(SecureStore.getItemAsync, "username");
  const password = yield call(SecureStore.getItemAsync, "password");

  if (!username || !password) {
    return;
  }

  yield fork(handleSignIn, signIn({ username, password }));
}

export const SESSION_ERROR = "SESSION_ERROR";

type SessionErrorPayload = RequestError;

export const sessionError = createAction<SessionErrorPayload>(SESSION_ERROR);

function* handleSessionError(action: PayloadAction<SessionErrorPayload>) {
  const { code } = action.payload;
  switch (code) {
    case "E0101400002":
      return yield put(
        setError({ username: "ユーザー名のフォーマットが間違っています" })
      );
    case "E0101400003":
      return yield put(
        setError({ password: "パスワードのフォーマットが間違っています" })
      );
    case "E0101401014":
      return yield put(setError({ password: "ログインに失敗しました" }));
    case "E0101401015":
      return yield put(setError({ username: "退会済みのユーザーです" }));
  }

  throw Error(`Unhandled request error with ${code}`);
}

function* handleAuthenticate(action: PayloadAction<AuthenticatePayload>) {
  yield call(SecureStore.setItemAsync, "username", action.payload.username);
  yield call(SecureStore.setItemAsync, "password", action.payload.password);
}

function* handleSignOut() {
  yield call(SecureStore.deleteItemAsync, "username");
  yield call(SecureStore.deleteItemAsync, "password");
}

export function* rootSaga() {
  yield takeEvery(SIGN_IN, handleSignIn);
  yield takeEvery(SESSION_ERROR, handleSessionError);
  yield takeEvery(RESTORE_SESSION, handleRestoreSession);
  yield takeEvery(authenticate.toString(), handleAuthenticate);
  yield takeEvery(signOut.toString(), handleSignOut);
}

export default slice;
