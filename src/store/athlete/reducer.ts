import { createReducer, PayloadAction } from "redux-starter-kit";
import {
  ADD_ATHLETE_MESSAGE,
  AddAthleteMessagePayload,
  DELETE_ATHLETE_MESSAGE,
  DeleteAthleteMessagePayload,
} from "./actions";
import { Message } from "../../lib/firestore.d";

export interface State {
  messages: {
    [athleteId: string]: {
      [messageId: string]: Message;
    };
  };
}

const initialState: State = {
  messages: {},
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
});
