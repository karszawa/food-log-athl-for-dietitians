import { createReducer, PayloadAction } from "redux-starter-kit";
import {
  FETCH_DIETITIAN,
  FETCH_DIETITIAN_SUCCESS,
  FetchDietitianSuccessPayload,
} from "./actions";
import { User, Id24, File } from "../../lib/foolog-api-client-types";

export interface State {
  id?: Id24;
  login_id?: string;
  nickname?: string;
  data?: any;
  users: User[];
  file?: File;
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
    state.id = action.payload.id;
    state.login_id = action.payload.login_id;
    state.nickname = action.payload.nickname;
    state.data = action.payload.data;
    state.users = action.payload.users;
    state.file = action.payload.file;
    state.processing = false;
  },
});
