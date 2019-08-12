import { createStackNavigator } from "react-navigation";
import { AthleteDetailScreen } from "../screens/AthleteDetailScreen";
import { AthleteListScreen } from "../screens/AthleteListScreen";
import { AthleteStatisticsScreen } from "../screens/AthleteStatisticsScreen";
import { AthleteStatisticsDetailScreen } from "../screens/AthleteStatisticsDetailScreen";
import { navigationOptions } from "../styles/navigation";
import {
  AthleteDetailScreenName,
  AthleteListScreenName,
  AthleteStatisticsScreenName,
  AthleteStatisticsDetailScreenName,
} from "./screen-names";

const navigator = createStackNavigator(
  {
    [AthleteListScreenName]: {
      screen: AthleteListScreen,
    },
    [AthleteDetailScreenName]: {
      screen: AthleteDetailScreen,
    },
    [AthleteStatisticsScreenName]: {
      screen: AthleteStatisticsScreen,
    },
    [AthleteStatisticsDetailScreenName]: {
      screen: AthleteStatisticsDetailScreen,
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
