import { createStackNavigator, createAppContainer } from "react-navigation";
import SignInScreen from "../screens/SignInScreen";
import Home from "../screens/HomeScreen";
import { SignInScreenId, HomeScreenId } from "./screen-names";

const navigator = createStackNavigator(
  {
    [SignInScreenId]: {
      screen: SignInScreen,
    },
    [HomeScreenId]: {
      screen: Home,
    },
  },
  {
    initialRouteName: SignInScreenId,
  }
);

export default createAppContainer(navigator);
