import { createAction } from "redux-starter-kit";
import { Dayjs } from "dayjs";
import { Message } from "../../lib/firestore.d";
import { Record } from "../../lib/foolog-api-client.d";

export const SUBSCRIBE_ATHLETE_MESSAGE = "SUBSCRIBE_ATHLETE_MESSAGE";

export interface SubscribeAthleteMessagePayload {
  athleteId: string;
}

export const subscribeAthleteMessage = createAction<
  SubscribeAthleteMessagePayload
>(SUBSCRIBE_ATHLETE_MESSAGE);

export const ADD_ATHLETE_MESSAGE = "ADD_ATHLETE_MESSAGE";

export interface AddAthleteMessagePayload {
  id: string;
  athleteId: string;
  message: Message;
}

export const addAthleteMessage = createAction<AddAthleteMessagePayload>(
  ADD_ATHLETE_MESSAGE
);

export const DELETE_ATHLETE_MESSAGE = "DELETE_ATHLETE_MESSAGE";

export interface DeleteAthleteMessagePayload {
  id: string;
  athleteId: string;
}

export const deleteAthleteMessage = createAction<DeleteAthleteMessagePayload>(
  DELETE_ATHLETE_MESSAGE
);

// export const FETCH_ATHLETE_RECORDS = "FETCH_ATHLETE_RECORDS";

// export interface FetchAthleteRecordsPayload {
//   athleteId: string;
//   from: string;
//   to: string;
// }

// export const fetchAthleteRecords = createAction<FetchAthleteRecordsPayload>(
//   FETCH_ATHLETE_RECORDS
// );

export const ADD_ATHLETE_RECORDS = "ADD_ATHLETE_RECORDS";

export interface AddAthleteRecordsPayload {
  athleteId: string;
  records: Record[];
}

export const addAthleteRecords = createAction<AddAthleteRecordsPayload>(
  ADD_ATHLETE_RECORDS
);

export const PUBLISH_MESSAGE = "PUBLISH_MESSAGE";

export interface PublishMessagePayload {
  athleteId: string;
  text: string;
}

export const publishMessage = createAction<PublishMessagePayload>(
  PUBLISH_MESSAGE
);

export const FETCH_LATEST_RECORDS = "FETCH_LATEST_RECORDS";

export interface FetchLatestRecordsPayload {
  athleteId: string;
  count: number;
}

export const fetchLatestRecords = createAction<FetchLatestRecordsPayload>(
  FETCH_LATEST_RECORDS
);

export const UPDATE_RANGE = "UPDATE_RANGE";

export interface UpdateRangePayload {
  athleteId: string;
  from: string;
  to: string;
}

export const updateRange = createAction<UpdateRangePayload>(UPDATE_RANGE);
