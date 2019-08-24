import { createAppContainer, createSwitchNavigator } from "react-navigation";
import AuthNavigator from "./auth";
import MainNavigator from "./main";

const navigator = createSwitchNavigator(
  {
    Main: MainNavigator,
    Auth: AuthNavigator,
  },
  {
    initialRouteName: "Auth",
  }
);

export default createAppContainer(navigator);
