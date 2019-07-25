import { getDefaultMiddleware, configureStore } from "redux-starter-kit";
import reducer from "./reducer";
import { State as AthleteState } from "./athlete/reducer";
import { State as AuthState } from "./auth/reducer";
import { State as DietitianState } from "./dietitian/reducer";
import saga, { rootSaga } from "./saga";

export interface RootState {
  athlete: AthleteState;
  auth: AuthState;
  dietitian: DietitianState;
}

export const createStore = () => {
  const middlewares = [...getDefaultMiddleware(), saga];
  const store = configureStore({
    reducer,
    middleware: middlewares,
    devTools: process.env.NODE_ENV !== "production",
  });

  saga.run(rootSaga);

  return store;
};
