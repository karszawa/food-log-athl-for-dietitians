import { createStackNavigator } from "react-navigation";
import SignInPage from "../screens/SignInScreen";

const navigator = createStackNavigator({
  SignIn: {
    screen: SignInPage,
  },
});

export default navigator;
