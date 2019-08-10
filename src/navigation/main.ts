import { createStackNavigator } from "react-navigation";
// import { fromLeft, flipY } from "react-navigation-transitions";
import { AthleteListScreenName, AthleteDetailScreenName } from "./screen-names";
import AthleteListScreen from "../screens/AthleteListScreen";
import { AthleteDetailScreen } from "../screens/AthleteDetailScreen";
import { navigationOptions } from "../styles/navigation";

// const handleCustomTransition = ({ scenes }) => {
//   const prevScene = scenes[scenes.length - 2];
//   const nextScene = scenes[scenes.length - 1];

//   // Custom transitions go there
//   if (
//     prevScene &&
//     prevScene.route.routeName === SignInScreenName &&
//     nextScene.route.routeName === HomeScreenName
//   ) {
//     return flipY();
//   }

//   return fromLeft();
// };

const navigator = createStackNavigator(
  {
    [AthleteListScreenName]: {
      screen: AthleteListScreen,
    },
    [AthleteDetailScreenName]: {
      screen: AthleteDetailScreen,
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
