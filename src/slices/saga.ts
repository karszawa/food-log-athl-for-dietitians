import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import createSagaMiddlewareHelpers from "redux-saga-watch-actions";
import { rootSaga as authSaga } from "./auth";

const sagaMiddleware = createSagaMiddleware();
export const runSaga = saga => sagaMiddleware.run(saga);
export const { injectSaga, cancelTask } = createSagaMiddlewareHelpers(runSaga);

export function* rootSaga() {
  yield all([authSaga()]);
}

export default sagaMiddleware;
