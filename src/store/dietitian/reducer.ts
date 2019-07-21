import { createReducer, PayloadAction } from "redux-starter-kit";
import {
  FETCH_DIETITIAN,
  FETCH_DIETITIAN_SUCCESS,
  FetchDietitianSuccessPayload,
} from "./actions";
import { User } from "../../lib/foodlog-api-client";

export interface State {
  users: User[];
  processing: boolean;
}

const initialState: State = {
  users: [],
  processing: false,
};

export default createReducer(initialState, {
  [FETCH_DIETITIAN]: (state: State) => {
    state.processing = true;
  },
  [FETCH_DIETITIAN_SUCCESS]: (
    state: State,
    action: PayloadAction<FetchDietitianSuccessPayload>
  ) => {
    state.users = action.payload.users;
    state.processing = false;
  },
});
