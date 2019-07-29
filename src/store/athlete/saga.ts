import { take, put, call, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "redux-starter-kit";
import { eventChannel } from "redux-saga";
import dayjs from "dayjs";
import {
  SUBSCRIBE_ATHLETE_MESSAGE,
  SubscribeAthleteMessagePayload,
  addAthleteMessage,
  deleteAthleteMessage,
  FetchAthleteRecordsPayload,
  addAthleteRecords,
  FETCH_ATHLETE_RECORDS,
} from "./actions";
import { db } from "../../lib/firestore";
import { Message } from "../../lib/firestore.d";
import { FooLogAPIClient } from "../../lib/foolog-api-client";
import { GetRecordsFoodsResponse } from "../../lib/foolog-api-client.d";

function* handleSubscribeAthleteMessage(
  action: PayloadAction<SubscribeAthleteMessagePayload>
) {
  const { athleteId } = action.payload;
  const endAt = dayjs()
    .subtract(12, "month")
    .toDate();

  const channel = eventChannel<{ data: firebase.firestore.DocumentChange }>(
    emitter =>
      db
        .collection(`users/${athleteId}/messages`)
        .orderBy("ts", "desc")
        .endAt(endAt)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            emitter({ data: change });
          });
        })
  );

  while (true) {
    const { data: change } = yield take(channel);
    const data = change.doc.data();

    if (!change) {
      break;
    }

    switch (change.type) {
      case "added":
      case "modified":
        yield put(
          addAthleteMessage({
            id: change.doc.id,
            athleteId,
            message: {
              ...data,
              id: change.doc.id,
              ts: data.ts.toDate().toString(),
            },
          })
        );
        break;
      case "removed":
        yield put(deleteAthleteMessage({ id: change.doc.id, athleteId }));
        break;
    }
  }
}

function* handleFetchAthleteRecords(
  action: PayloadAction<FetchAthleteRecordsPayload>
) {
  const { athleteId, from, to } = action.payload;

  const data: GetRecordsFoodsResponse = yield call(
    [FooLogAPIClient, FooLogAPIClient.getRecordsFoods],
    { athleteId, from, to }
  );

  yield put(addAthleteRecords({ athleteId, records: data.records }));
}

export function* rootSaga() {
  yield takeEvery(SUBSCRIBE_ATHLETE_MESSAGE, handleSubscribeAthleteMessage);
  yield takeEvery(FETCH_ATHLETE_RECORDS, handleFetchAthleteRecords);
}
