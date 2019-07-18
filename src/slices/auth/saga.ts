import * as SecureStore from "expo-secure-store";
import { PayloadAction } from "redux-starter-kit";
import { call, put, fork, takeEvery } from "redux-saga/effects";
import FooLogAPIClient from "../../lib/foolog-api-client";
import { extendsRequestError } from "../../lib/error";
import {
  TRY_SIGN_IN,
  TrySignInPayload,
  signInSuccess,
  signInFailed,
  SIGN_OUT,
  SIGN_IN_SUCCESS,
  SignInSuccessPayload,
  RESTORE_SESSION,
  trySignIn,
} from "./actions";

function* handleTrySignIn(action: PayloadAction<TrySignInPayload>) {
  try {
    yield call(
      [FooLogAPIClient, FooLogAPIClient.postDietitiansSession],
      action.payload
    );
    yield put(signInSuccess(action.payload));
  } catch (e) {
    if (extendsRequestError(e)) {
      yield fork(handleSignInError, e.code);
    } else {
      throw e;
    }
  }
}

function* handleRestoreSession() {
  const username: string = yield call(
    [SecureStore, SecureStore.getItemAsync],
    "username"
  );
  const password: string = yield call(
    [SecureStore, SecureStore.getItemAsync],
    "password"
  );

  if (!username || !password) {
    return;
  }

  yield fork(handleTrySignIn, trySignIn({ username, password }));
}

function* handleSignInError(code: string) {
  switch (code) {
    case "E7101400002":
      return yield put(
        signInFailed({ username: "ユーザー名のフォーマットが間違っています" })
      );
    case "E7101400003":
      return yield put(
        signInFailed({ password: "パスワードのフォーマットが間違っています" })
      );
    case "E7101401010":
      return yield put(signInFailed({ password: "ログインに失敗しました" }));
    case "E7101401011":
      return yield put(signInFailed({ username: "退会済みのユーザーです" }));
  }

  throw Error(`Unhandled request error with ${code}`);
}

function* handleSignInSuccess(action: PayloadAction<SignInSuccessPayload>) {
  yield call(
    [SecureStore, SecureStore.setItemAsync],
    "username",
    action.payload.username
  );
  yield call(
    [SecureStore, SecureStore.setItemAsync],
    "password",
    action.payload.password
  );
}

function* handleSignOut() {
  yield call([SecureStore, SecureStore.deleteItemAsync], "username");
  yield call([SecureStore, SecureStore.deleteItemAsync], "password");
}

export function* rootSaga() {
  yield takeEvery(TRY_SIGN_IN, handleTrySignIn);
  yield takeEvery(SIGN_IN_SUCCESS, handleSignInSuccess);
  yield takeEvery(RESTORE_SESSION, handleRestoreSession);
  yield takeEvery(SIGN_OUT, handleSignOut);
}
