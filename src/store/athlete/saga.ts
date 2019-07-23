import { take, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "redux-starter-kit";
import { eventChannel } from "redux-saga";
import {
  SUBSCRIBE_ATHLETE_MESSAGE,
  SubscribeAthleteMessagePayload,
  addAthleteMessage,
  deleteAthleteMessage,
} from "./actions";
import { db } from "../../lib/firestore";

function* handleSubscribeAthleteMessage(
  action: PayloadAction<SubscribeAthleteMessagePayload>
) {
  const { athleteId } = action.payload;

  const channel = eventChannel<{ data: firebase.firestore.DocumentChange }>(
    emitter =>
      db
        .collection(`users/${athleteId}/messages`)
        .orderBy("ts", "desc")
        .endAt(this.startDate.toJSDate())
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            emitter({ data: change });
          });
        })
  );

  while (true) {
    const { data: change } = yield take(channel);

    if (!change) {
      break;
    }

    switch (change.type) {
      case "added":
      case "modified":
        yield put(
          addAthleteMessage({
            id: change.doc.id,
            message: change.doc.data(),
          })
        );
        break;
      case "removed":
        yield put(deleteAthleteMessage({ id: change.doc.id }));
        break;
    }
  }
}

export function* rootSaga() {
  yield takeEvery(SUBSCRIBE_ATHLETE_MESSAGE, handleSubscribeAthleteMessage);
}
