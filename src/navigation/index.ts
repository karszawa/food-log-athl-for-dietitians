import { createAppContainer, createDrawerNavigator } from "react-navigation";
import AuthNavigator from "./auth";
import MainNavigator from "./main";
import SettingNavigator from "./setting";
import { CustomDrawerContentComponent } from "../components/DrawerContent";

const navigator = createDrawerNavigator(
  {
    Main: MainNavigator,
    Auth: AuthNavigator,
    Setting: SettingNavigator,
  },
  {
    initialRouteName: "Auth",
    contentComponent: CustomDrawerContentComponent,
  }
);

export default createAppContainer(navigator);
