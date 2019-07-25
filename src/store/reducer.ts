import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import athleteReducer from "./athlete/reducer";
import dietitianReducer from "./dietitian/reducer";

export default combineReducers({
  athlete: athleteReducer,
  auth: authReducer,
  dietitian: dietitianReducer,
});
