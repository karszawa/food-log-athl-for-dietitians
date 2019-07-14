import SecureStore from "expo-secure-store";
import { createSlice, PayloadAction } from "redux-starter-kit";
import FooLogAPIClient from "../lib/foolog-api-client";

export interface State {
  username: string;
  password: string;
  authenticated: boolean;
  processing: boolean;
  errors?: { [key in "username" | "password"]: string };
}

const initialState: State = {
  username: "",
  password: "",
  authenticated: false,
  processing: false,
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
      SecureStore.deleteItemAsync("username");
      SecureStore.deleteItemAsync("password");
    },
    signIn(state: State, action: PayloadAction<SignInPayload>) {
      state.processing = true;
      const { username, password } = action.payload;

      FooLogAPIClient.postSession({ username, password })
        .then(() => {
          console.log("after post session");
          state.username = username;
          state.password = password;
          state.authenticated = true;
          state.processing = false;
          SecureStore.getItemAsync("username");
          SecureStore.getItemAsync("password");
        })
        .catch(e => {
          state.errors.password = e.code;
        });
    },
    restoreSession(state: State) {
      (async () => {
        state.processing = true;
        const username = await SecureStore.getItemAsync("username");
        const password = await SecureStore.getItemAsync("password");

        FooLogAPIClient.postSession({ username, password }).then(() => {
          state.username = username;
          state.password = password;
          state.authenticated = true;
          state.processing = false;
        });
      })();
    },
  },
});

export const { signOut, signIn, restoreSession } = slice.actions;
export default slice;
