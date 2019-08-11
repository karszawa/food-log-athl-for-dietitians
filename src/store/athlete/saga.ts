import { take, put, call, takeEvery, select, fork } from "redux-saga/effects";
import { PayloadAction } from "redux-starter-kit";
import { eventChannel, END, EventChannel } from "redux-saga";
import dayjs, { Dayjs } from "dayjs";
import { firestore } from "firebase";
import { min } from "lodash-es";
import {
  SUBSCRIBE_ATHLETE_MESSAGE,
  SubscribeAthleteMessagePayload,
  addAthleteMessage,
  deleteAthleteMessage,
  addAthleteRecords,
  PublishMessagePayload,
  PUBLISH_MESSAGE,
  FETCH_LATEST_RECORDS,
  FetchLatestRecordsPayload,
  updateRange,
  fetchLatestRecordsSucceeded,
} from "./actions";
import { db } from "../../lib/firestore";
import { FooLogAPIClient } from "../../lib/foolog-api-client";
import { GetRecordsDailyResponse } from "../../lib/foolog-api-client.d";
import { State } from "./reducer";
import { RootState } from "..";

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

  yield fork(handleMessageDocumentChange, athleteId, channel);
}

function* fetchAthleteMessages(
  athleteId: string,
  fromDate: Dayjs,
  toDate: Dayjs
) {
  const channel = eventChannel<{ data: firebase.firestore.DocumentChange }>(
    emitter => {
      db.collection(`users/${athleteId}/messages`)
        .orderBy("ts", "desc")
        .startAt(toDate.toDate())
        .endAt(fromDate.toDate())
        .get()
        .then(snapshot => {
          snapshot.docChanges().forEach(change => {
            emitter({ data: change });
          });

          emitter(END);
        });
      return () => {};
    }
  );

  yield fork(handleMessageDocumentChange, athleteId, channel);
}

function* handleMessageDocumentChange(
  athleteId: string,
  channel: EventChannel<{
    data: firestore.DocumentChange;
  }>
) {
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

// function* handleFetchAthleteRecords(
//   action: PayloadAction<FetchAthleteRecordsPayload>
// ) {
//   const { athleteId, from, to } = action.payload;

//   const data: GetRecordsFoodsResponse = yield call(
//     [FooLogAPIClient, FooLogAPIClient.getRecordsFoods],
//     { athleteId, from, to, detail: true, expiry_sec: 900 }
//   );

//   yield put(addAthleteRecords({ athleteId, records: data.records }));
// }

function* handlePublishMessage(action: PayloadAction<PublishMessagePayload>) {
  const { athleteId, text } = action.payload;
  const dietitianId = yield select((state: RootState) => state.dietitian.id);

  db.collection(`users/${athleteId}/messages`).add({
    from: dietitianId,
    text,
    ts: firestore.Timestamp.now(),
  });
}

function* handleFetchLatestRecords(
  action: PayloadAction<FetchLatestRecordsPayload>
) {
  const { athleteId, count } = action.payload;
  const { range }: State = yield select((state: RootState) => state.athlete);
  const nextFromDate = dayjs(range.from).subtract(count, "day");
  const nextToDate = dayjs(range.from);

  const response: GetRecordsDailyResponse = yield call(
    [FooLogAPIClient, FooLogAPIClient.getRecordsDaily],
    {
      athleteId,
      from: nextFromDate,
      to: nextToDate,
      food: true,
      latest: true,
    }
  );
  const records = response.records.find(r => r.type === "food").records;
  const actualFromDate = records.reduce(
    (minDate, current) => min([minDate, dayjs(current.datetime)]),
    nextFromDate
  );

  yield put(addAthleteRecords({ athleteId, records }));
  yield call(fetchAthleteMessages, athleteId, actualFromDate, nextToDate);
  yield put(
    updateRange({ athleteId, from: actualFromDate.toISOString(), to: range.to })
  );
  yield put(fetchLatestRecordsSucceeded());
}

export function* rootSaga() {
  yield takeEvery(SUBSCRIBE_ATHLETE_MESSAGE, handleSubscribeAthleteMessage);
  // yield takeEvery(FETCH_ATHLETE_RECORDS, handleFetchAthleteRecords);
  yield takeEvery(PUBLISH_MESSAGE, handlePublishMessage);
  yield takeEvery(FETCH_LATEST_RECORDS, handleFetchLatestRecords);
}
