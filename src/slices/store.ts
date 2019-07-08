import { getDefaultMiddleware, configureStore } from "redux-starter-kit";
import logger from "redux-logger";
import reducer from "./reducer";
import { State as AuthState } from "./auth";

export interface RootState {
  auth: AuthState;
}

export const createStore = () => {
  const middlewares = [...getDefaultMiddleware(), logger];
  const store = configureStore({
    reducer,
    middleware: middlewares,
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};
