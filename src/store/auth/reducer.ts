import { PayloadAction, createReducer } from "redux-starter-kit";
import {
  TRY_SIGN_IN,
  TrySignInPayload,
  SIGN_IN_SUCCESS,
  SignInSuccessPayload,
  SIGN_IN_FAILED,
  SignInFailedPayload,
  SIGN_OUT,
} from "./actions";

export interface State {
  username: string;
  password: string;
  authenticated: boolean;
  processing: boolean;
  errors: {
    overall?: string;
    username?: string;
    password?: string;
  };
}

const initialState: State = {
  username: "",
  password: "",
  authenticated: false,
  processing: false,
  errors: {},
};

export default createReducer(initialState, {
  [TRY_SIGN_IN]: (state: State, action: PayloadAction<TrySignInPayload>) => {
    state.processing = true;
  },
  [SIGN_OUT]: (state: State) => {
    state.username = "";
    state.password = "";
    state.authenticated = false;
  },
  [SIGN_IN_SUCCESS]: (
    state: State,
    action: PayloadAction<SignInSuccessPayload>
  ) => {
    state.username = action.payload.username;
    state.password = action.payload.password;
    state.processing = false;
    state.authenticated = true;
  },
  [SIGN_IN_FAILED]: (
    state: State,
    action: PayloadAction<SignInFailedPayload>
  ) => {
    state.errors = action.payload;
    state.processing = false;
  },
});
