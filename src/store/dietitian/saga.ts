import { call, put, takeEvery } from "redux-saga/effects";
import { FooLogAPIClient } from "../../lib/foolog-api-client";
import { FETCH_DIETITIAN, fetchDietitianSuccess } from "./actions";

function* handleFetchDietitian() {
  const data = yield call([FooLogAPIClient, FooLogAPIClient.getDietitians]);
  yield put(fetchDietitianSuccess(data));
}

export function* rootSaga() {
  yield takeEvery(FETCH_DIETITIAN, handleFetchDietitian);
}
