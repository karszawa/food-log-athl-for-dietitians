import { createStackNavigator } from "react-navigation";
// import { fromLeft, flipY } from "react-navigation-transitions";
import { HomeScreenName } from "./screen-names";
import HomeScreen from "../screens/HomeScreen";

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

const navigator = createStackNavigator({
  [HomeScreenName]: {
    screen: HomeScreen,
  },
});

export default navigator;
