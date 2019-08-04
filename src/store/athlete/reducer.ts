import { createReducer, PayloadAction } from "redux-starter-kit";
import {
  ADD_ATHLETE_MESSAGE,
  AddAthleteMessagePayload,
  DELETE_ATHLETE_MESSAGE,
  DeleteAthleteMessagePayload,
  ADD_ATHLETE_RECORDS,
  AddAthleteRecordsPayload,
} from "./actions";
import { Message } from "../../lib/firestore.d";
import { Record } from "../../lib/foolog-api-client.d";

export interface State {
  messages: {
    [athleteId: string]: {
      [messageId: string]: Message;
    };
  };
  records: {
    [athleteId: string]: {
      [recordId: string]: Record;
    };
  };
}

const initialState: State = {
  messages: {},
  records: {},
};

export default createReducer(initialState, {
  [ADD_ATHLETE_MESSAGE]: (
    state: State,
    action: PayloadAction<AddAthleteMessagePayload>
  ) => {
    const { id, message, athleteId } = action.payload;

    if (!state.messages[athleteId]) {
      state.messages[athleteId] = {};
    }

    state.messages[athleteId][id] = message;
  },
  [DELETE_ATHLETE_MESSAGE]: (
    state: State,
    action: PayloadAction<DeleteAthleteMessagePayload>
  ) => {
    const { id, athleteId } = action.payload;

    if (state.messages[athleteId]) {
      delete state.messages[athleteId][id];
    }
  },
  [ADD_ATHLETE_RECORDS]: (
    state: State,
    action: PayloadAction<AddAthleteRecordsPayload>
  ) => {
    const { records, athleteId } = action.payload;

    if (!state.records[athleteId]) {
      state.records[athleteId] = {};
    }

    records.forEach(record => {
      state.records[athleteId][record.id] = record;
    });
  },
});
