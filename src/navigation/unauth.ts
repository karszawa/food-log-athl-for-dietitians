import { createStackNavigator } from "react-navigation";
import { SignOutScreenName } from "./screen-names";
import { navigationOptions } from "../styles/navigation";
import { SignOutScreen } from "../screens/SignOutScreen";

const navigator = createStackNavigator(
  {
    [SignOutScreenName]: {
      screen: SignOutScreen,
    },
  },
  {
    initialRouteName: SignOutScreenName,
    defaultNavigationOptions: {
      ...navigationOptions,
    },
  }
);

export default navigator;
