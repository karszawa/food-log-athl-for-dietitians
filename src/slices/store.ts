import { getDefaultMiddleware, configureStore } from "redux-starter-kit";
import logger from "redux-logger";
import reducer from "./reducer";
import { State as AuthState } from "./auth";
import saga, { rootSaga } from "./saga";

export interface RootState {
  auth: AuthState;
}

export const createStore = () => {
  const middlewares = [...getDefaultMiddleware(), logger, saga];
  const store = configureStore({
    reducer,
    middleware: middlewares,
    devTools: process.env.NODE_ENV !== "production",
  });

  saga.run(rootSaga);

  return store;
};
