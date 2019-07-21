import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import dietitianReducer from "./dietitian/reducer";

export default combineReducers({
  auth: authReducer,
  dietitian: dietitianReducer,
});
