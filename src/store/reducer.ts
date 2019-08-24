import { combineReducers } from "redux";
import appReducer from "./app/reducer";
import authReducer from "./auth/reducer";
import athleteReducer from "./athlete/reducer";
import dietitianReducer from "./dietitian/reducer";

export default combineReducers({
  app: appReducer,
  athlete: athleteReducer,
  auth: authReducer,
  dietitian: dietitianReducer,
});
