import { Updates } from "expo";
import { call, takeEvery } from "redux-saga/effects";
import { REQUEST_BUNDLE_UPDATE } from "./actions";

const strings = {
  successUpdate: "アプリを更新しました",
  failUpdate: "アプリの更新ができませんでした",
  skipUpdate: "アプリは最新版のため更新しませんでした",
};

export function* handleRequestBundleUpdate() {
  let hasError: boolean = false;
  let isUpdated: boolean = false;

  try {
    const update = yield call([Updates, Updates.checkForUpdateAsync]);

    if (update.isAvailable) {
      yield call([Updates, Updates.fetchUpdateAsync]);
      yield call([Updates, Updates.reloadFromCache]);
      isUpdated = true;
    }
  } catch (e) {
    hasError = true;
    alert(strings.failUpdate);
    throw e;
  } finally {
    if (hasError) {
      alert(strings.failUpdate);
    } else if (isUpdated) {
      alert(strings.successUpdate);
    } else {
      alert(strings.skipUpdate);
    }
  }
}

export function* rootSaga() {
  yield takeEvery(REQUEST_BUNDLE_UPDATE, handleRequestBundleUpdate);
}
