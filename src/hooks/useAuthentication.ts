import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import { SignInScreenName } from "../navigation/screen-names";

export const useAuthentication = (
  navigation: NavigationScreenProp<NavigationRoute>
) => {
  const { username, authenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!authenticated) {
      navigation.navigate(SignInScreenName);
    }
  }, [username, authenticated]);

  return { sid: username };
};
