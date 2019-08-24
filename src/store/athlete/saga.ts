import dayjs, { Dayjs } from "dayjs";
import { firestore } from "firebase";
import { get, min } from "lodash-es";
import { END, eventChannel, EventChannel } from "redux-saga";
import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "redux-starter-kit";
import { db } from "../../lib/firestore";
import { Message } from "../../lib/firestore-types";
import { FooLogAPIClient } from "../../lib/foolog-api-client";
import {
  GetRecordsDailyResponse,
  GetRecordsFoodsIdResponse,
} from "../../lib/foolog-api-client-types";
import {
  addAthleteMessage,
  AddAthleteMessagePayload,
  addAthleteRecords,
  ADD_ATHLETE_MESSAGE,
  deleteAthleteMessage,
  FetchAthleteRecordPayload,
  fetchAthleteRecords,
  fetchAthleteRecordSucceeded,
  FetchBodyRecordsPayload,
  fetchBodyRecordsSucceeded,
  FetchLatestRecordsPayload,
  fetchLatestRecordsSucceeded,
  FetchNutritionAmountPayload,
  fetchNutritionAmountSucceeded,
  FETCH_ATHLETE_RECORD,
  FETCH_BODY_RECORDS,
  FETCH_LATEST_RECORDS,
  FETCH_NUTRITION_AMOUNT,
  PublishMessagePayload,
  PUBLISH_MESSAGE,
  SubscribeAthleteMessagePayload,
  SUBSCRIBE_ATHLETE_MESSAGE,
  updateRange,
} from "./actions";
import { State } from "./reducer";
import { RootState } from "..";

// Subscribe only new messages
function* handleSubscribeAthleteMessage(
  action: PayloadAction<SubscribeAthleteMessagePayload>
) {
  const { athleteId } = action.payload;

  const channel = eventChannel<{ data: firebase.firestore.DocumentChange }>(
    emitter =>
      db
        .collection(`users/${athleteId}/messages`)
        .orderBy("ts", "desc")
        .endAt(new Date())
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

const isFirestoreTimestamp = (obj: any): obj is firestore.Timestamp => {
  return obj && Boolean(obj.seconds);
};

function serialize(obj: any) {
  if (isFirestoreTimestamp(obj)) {
    return obj.toDate().toString();
  }

  if (!obj) {
    return obj;
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [key, serialize(val)])
    );
  }

  return obj;
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
              ...serialize(data),
              id: change.doc.id,
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

function* handleFetchAthleteRecord(
  action: PayloadAction<FetchAthleteRecordPayload>
) {
  const result: GetRecordsFoodsIdResponse = yield call(
    [FooLogAPIClient, FooLogAPIClient.getRecordsFoodsId],
    action.payload
  );

  yield put(
    fetchAthleteRecordSucceeded({
      athleteId: action.payload.athleteId,
      record: result,
    })
  );
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
  const originalFromDate = get(range[athleteId], "from", dayjs().toISOString());
  const originalToDate = get(range[athleteId], "to", dayjs().toISOString());
  const nextFromDate = dayjs(originalFromDate).subtract(count, "day");
  const nextToDate = dayjs(originalFromDate);

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
    updateRange({
      athleteId,
      from: actualFromDate.toISOString(),
      to: originalToDate,
    })
  );
  yield put(fetchLatestRecordsSucceeded());
}

function* handleFetchNutritionAmount(
  action: PayloadAction<FetchNutritionAmountPayload>
) {
  const data = yield call(
    [FooLogAPIClient, FooLogAPIClient.getUserNutritionAmount],
    action.payload
  );

  yield put(
    fetchNutritionAmountSucceeded({
      ...data,
      athleteId: action.payload.athleteId,
    })
  );
}

function* handleFetchBodyRecords(
  action: PayloadAction<FetchBodyRecordsPayload>
) {
  const data = yield call(
    [FooLogAPIClient, FooLogAPIClient.getRecordsBody],
    action.payload
  );

  yield put(
    fetchBodyRecordsSucceeded({
      ...data,
      athleteId: action.payload.athleteId,
    })
  );
}

function* handleAddMessage(action: PayloadAction<AddAthleteMessagePayload>) {
  const { athleteId, id, message } = action.payload;

  switch (message.type) {
    case "NEW_RECORD":
      return yield handleNewRecordMessage(athleteId, id, message);
  }
}

function* handleNewRecordMessage(
  athleteId: string,
  id: string,
  message: Message
) {
  const record = select(
    (state: RootState) => state.athlete.records[athleteId][recordId]
  );

  if (record) {
    return;
  }

  const { recordId } = JSON.parse(message.text);
  yield put(fetchAthleteRecords({ athleteId, recordId }));
}

export function* rootSaga() {
  yield takeEvery(SUBSCRIBE_ATHLETE_MESSAGE, handleSubscribeAthleteMessage);
  // yield takeEvery(FETCH_ATHLETE_RECORDS, handleFetchAthleteRecords);
  yield takeEvery(PUBLISH_MESSAGE, handlePublishMessage);
  yield takeEvery(FETCH_LATEST_RECORDS, handleFetchLatestRecords);
  yield takeEvery(FETCH_NUTRITION_AMOUNT, handleFetchNutritionAmount);
  yield takeEvery(FETCH_BODY_RECORDS, handleFetchBodyRecords);
  yield takeEvery(ADD_ATHLETE_MESSAGE, handleAddMessage);
  yield takeEvery(FETCH_ATHLETE_RECORD, handleFetchAthleteRecord);
}
