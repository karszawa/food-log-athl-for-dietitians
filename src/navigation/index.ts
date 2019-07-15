import { createAppContainer, createSwitchNavigator } from "react-navigation";
import AuthNavigator from "./auth";
import MainNavigator from "./main";

const navigator = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Main: MainNavigator,
  },
  {
    initialRouteName: "Auth",
  }
);

export default createAppContainer(navigator);
