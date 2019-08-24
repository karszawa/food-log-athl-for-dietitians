import { createStackNavigator } from "react-navigation";
import { SettingScreenName } from "./screen-names";
import { SettingScreen } from "../screens/SettingScreen";
import { navigationOptions } from "../styles/navigation";

export default createStackNavigator(
  {
    [SettingScreenName]: {
      screen: SettingScreen,
    },
  },
  {
    initialRouteName: SettingScreenName,
    defaultNavigationOptions: {
      ...navigationOptions,
    },
  }
);
