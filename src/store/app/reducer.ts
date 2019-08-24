import { createReducer, PayloadAction } from "redux-starter-kit";
import { SHOW_PROGRESS, ShowProgressPayload, HIDE_PROGRESS } from "./actions";

export interface State {
  refc: number;
  message: string;
}

const initialState: State = {
  refc: 0,
  message: "",
};

export default createReducer(initialState, {
  [SHOW_PROGRESS]: (
    state: State,
    action: PayloadAction<ShowProgressPayload>
  ) => {
    state.refc += 1;
    state.message = action.payload.message;
  },
  [HIDE_PROGRESS]: (state: State) => {
    state.refc -= 1;
    state.message = "";
  },
});
