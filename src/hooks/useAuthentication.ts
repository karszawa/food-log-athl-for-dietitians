import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { RootState } from "../store";
import { SignInScreenName } from "../navigation/screen-names";
import { signOut } from "../store/auth/actions";

export const useAuthentication = (
  navigation: NavigationScreenProp<NavigationRoute>
) => {
  const dispatch = useDispatch();
  const { username, authenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!authenticated) {
      navigation.navigate(SignInScreenName);
    }
  }, [username, authenticated]);

  const signOutCallback = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  return { sid: username, signOut: signOutCallback };
};
