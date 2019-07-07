import { createStackNavigator, createAppContainer } from 'react-navigation';
import SignInPage from '../pages/SignIn';

const navigator = createStackNavigator({
  SignIn: {
    screen: SignInPage,
  },
});

export default createAppContainer(navigator);
