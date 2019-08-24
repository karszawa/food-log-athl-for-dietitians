import { createAppContainer, createDrawerNavigator } from "react-navigation";
import AuthNavigator from "./auth";
import MainNavigator from "./main";
import UnauthNavigator from "./unauth";
import SettingNavigator from "./setting";
import { CustomDrawerContentComponent } from "../components/DrawerContent";

const navigator = createDrawerNavigator(
  {
    Main: MainNavigator,
    Auth: AuthNavigator,
    Setting: SettingNavigator,
    Unauth: UnauthNavigator,
  },
  {
    initialRouteName: "Auth",
    contentComponent: CustomDrawerContentComponent,
  }
);

export default createAppContainer(navigator);
