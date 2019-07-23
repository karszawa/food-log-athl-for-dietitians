import { createReducer, PayloadAction } from "redux-starter-kit";
import {
  ADD_ATHLETE_MESSAGE,
  AddAthleteMessagePayload,
  DELETE_ATHLETE_MESSAGE,
  DeleteAthleteMessagePayload,
} from "./actions";
import { Message } from "../../lib/firestore";

export interface State {
  messages: {
    [id: string]: Message;
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
    const { id, message } = action.payload;

    state.messages[id] = message;
  },
  [DELETE_ATHLETE_MESSAGE]: (
    state: State,
    action: PayloadAction<DeleteAthleteMessagePayload>
  ) => {
    delete state.messages[action.payload.id];
  },
});
