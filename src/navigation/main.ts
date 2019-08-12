import { createStackNavigator } from "react-navigation";
import { AthleteDetailScreen } from "../screens/AthleteDetailScreen";
import { AthleteListScreen } from "../screens/AthleteListScreen";
import { AthleteStatisticsScreen } from "../screens/AthleteStatistics";
import { navigationOptions } from "../styles/navigation";
import {
  AthleteDetailScreenName,
  AthleteListScreenName,
  AthleteStatisticsName,
} from "./screen-names";

const navigator = createStackNavigator(
  {
    [AthleteListScreenName]: {
      screen: AthleteListScreen,
    },
    [AthleteDetailScreenName]: {
      screen: AthleteDetailScreen,
    },
    [AthleteStatisticsName]: {
      screen: AthleteStatisticsScreen,
    },
  },
  {
    initialRouteName: AthleteListScreenName,
    defaultNavigationOptions: {
      ...navigationOptions,
    },
  }
);

export default navigator;
