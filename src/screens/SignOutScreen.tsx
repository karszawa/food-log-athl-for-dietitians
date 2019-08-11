import React, { useEffect } from "react";
import { NavigationScreenComponent } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "native-base";
import { signOut } from "../store/auth/actions";
import { RootState } from "../store";
import { SignInScreenName } from "../navigation/screen-names";
import { Loading } from "../components/Loading";

interface Params {}

export const SignOutScreen: NavigationScreenComponent<Params> = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(signOut());
  }, [navigation, dispatch]);

  useEffect(() => {
    if (!authenticated) {
      navigation.navigate(SignInScreenName);
    }
  }, [authenticated]);

  return (
    <Container style={{ flex: 1 }}>
      <Loading />
    </Container>
  );
};
