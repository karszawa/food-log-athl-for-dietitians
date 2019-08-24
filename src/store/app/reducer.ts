import { createReducer, PayloadAction } from "redux-starter-kit";
import { SHOW_PROGRESS, ShowProgressPayload, HIDE_PROGRESS } from "./actions";

export interface State {
  isLoading: boolean;
  message: string;
}

const initialState: State = {
  isLoading: false,
  message: "",
};

export default createReducer(initialState, {
  [SHOW_PROGRESS]: (
    state: State,
    action: PayloadAction<ShowProgressPayload>
  ) => {
    state.isLoading = true;
    state.message = action.payload.message;
  },
  [HIDE_PROGRESS]: (state: State) => {
    state.isLoading = false;
    state.message = "";
  },
});
