import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import createSagaMiddlewareHelpers from "redux-saga-watch-actions";
import { rootSaga as athleteSaga } from "./athlete/saga";
import { rootSaga as authSaga } from "./auth/saga";
import { rootSaga as dietitianSaga } from "./dietitian/saga";
import { extendsRequestError } from "../lib/error";

const sagaMiddleware = createSagaMiddleware();
export const runSaga = saga => sagaMiddleware.run(saga);
export const { injectSaga, cancelTask } = createSagaMiddlewareHelpers(runSaga);

export function* rootSaga() {
  try {
    yield all([athleteSaga(), authSaga(), dietitianSaga()]);
  } catch (e) {
    if (extendsRequestError(e)) {
      alert(`ネットワークエラーが発生しました。エラーコード: ${e.code}`);
      // should send network request
    }

    if (process.env.NODE_ENV !== "production") {
      throw e;
    }
  }
}

export default sagaMiddleware;
