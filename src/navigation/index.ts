import { createStackNavigator, createAppContainer } from "react-navigation";
import SignInScreen from "../screens/SignInScreen";

const navigator = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
  },
});

export default createAppContainer(navigator);
