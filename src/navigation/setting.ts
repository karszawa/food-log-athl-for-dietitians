import { createStackNavigator } from "react-navigation";
import { SettingScreenName } from "./screen-names";
import { SettingScreen } from "../screens/SettingScreen";
import { navigationOptions } from "../styles/navigation";

const navigator = createStackNavigator(
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

export default navigator;
