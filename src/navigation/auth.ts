import { createStackNavigator } from "react-navigation";
import SignInScreen from "../screens/SignInScreen";
import { SignInScreenName } from "./screen-names";

const navigator = createStackNavigator(
  {
    [SignInScreenName]: {
      screen: SignInScreen,
    },
  },
  {
    initialRouteName: SignInScreenName,
  }
);

export default navigator;
