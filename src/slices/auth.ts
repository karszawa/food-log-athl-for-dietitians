import { createSlice, PayloadAction } from "redux-starter-kit";

export interface State {
  username: string;
  password: string;
  token: string;
  token_secret: string;
  expiry_time: string;
  refresh_token: string;
  refresh_token_secret: string;
  refresh_token_expiry_time: string;
  errors?: { [key in "username" | "password"]: string };
}

const initialState: State = {
  username: "",
  password: "",
  token: "",
  token_secret: "",
  expiry_time: "",
  refresh_token: "",
  refresh_token_secret: "",
  refresh_token_expiry_time: "",
};

interface SignInPayload {
  username: string;
  password: string;
}

const slice = createSlice({
  initialState,
  reducers: {
    signOut(state: State) {
      Object.assign(state, initialState);
    },
    signIn(state: State, action: PayloadAction<SignInPayload>) {
      const { username, password } = action.payload;

      // NOTE: Instead of API Call
      setTimeout(() => {
        Object.assign(state, { username, password });
      }, 3000);
    },
  },
});

export const { signOut, signIn } = slice.actions;
export default slice;
