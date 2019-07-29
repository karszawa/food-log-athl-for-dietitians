import { NavigationActions } from "react-navigation";
import { Navigator } from "../../navigation";

const initialState = Navigator.router.getStateForAction(
  NavigationActions.init()
);

export const reducer = (state, action) => {
  const nextState = Navigator.router.getStateForAction(action, state);
  return nextState || initialState;
};
