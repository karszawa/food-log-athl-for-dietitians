import { createStackNavigator } from "react-navigation";
import SignInScreen from "../screens/SignInScreen";
import { SignInScreenName } from "./screen-names";
import { navigationOptions } from "../styles/navigation";

const navigator = createStackNavigator(
  {
    [SignInScreenName]: {
      screen: SignInScreen,
    },
  },
  {
    initialRouteName: SignInScreenName,
    defaultNavigationOptions: {
      ...navigationOptions,
    },
  }
);

export default navigator;
