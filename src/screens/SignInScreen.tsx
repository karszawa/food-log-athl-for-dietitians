import { LinearGradient } from "expo-linear-gradient";
import { Card, Title } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Button, ButtonProps, Input } from "react-native-elements";
import {
  NavigationRoute,
  NavigationScreenComponent,
  NavigationScreenProp,
} from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { OverlayLoading } from "../components/Loading";
import { AthleteListScreenName } from "../navigation/screen-names";
import { RootState } from "../store";
import { restoreSession, trySignIn } from "../store/auth/actions";
import { PRIMARY_ORANGE, STRONG_PINK } from "../styles/color";
import { Container } from "../styles/layout";

const strings = {
  title: "FoodLog Athl",
  guideText: "サインイン",
  submit: "サインイン",
};

interface Params {
  refresh: boolean;
}

interface Props {}

const SignInPage: NavigationScreenComponent<Params, {}, Props> = props => {
  useRouter({ navigation: props.navigation });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { processing, errors } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const onPressSubmitButton = useCallback(() => {
    dispatch(trySignIn({ username, password }));
  }, [username, password]);
  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  return (
    <>
      <StyledContainer>
        <StyledCard>
          <StyledTitle>{strings.guideText}</StyledTitle>
          <UserNameInput
            value={username}
            onChangeText={setUsername}
            errorMessage={errors && errors.username}
          />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            errorMessage={errors && errors.password}
          />
          <SubmitButton onPress={onPressSubmitButton} loading={processing} />
        </StyledCard>
      </StyledContainer>
    </>
  );
};

SignInPage.navigationOptions = {
  title: strings.title,
};

interface RouterProps {
  navigation: NavigationScreenProp<NavigationRoute>;
}

const useRouter = ({ navigation }: RouterProps) => {
  const { authenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authenticated) {
      navigation.navigate(AthleteListScreenName);
    }
  }, [authenticated]);
};

const UserNameInput = (props: any) => (
  <Input
    {...props}
    autoCapitalize="none"
    containerStyle={{ marginTop: 4 }}
    placeholder="ユーザー名"
    leftIcon={{ type: "material", name: "person" }}
    leftIconContainerStyle={{ paddingRight: 12 }}
  />
);

const PasswordInput = (props: any) => (
  <Input
    {...props}
    secureTextEntry
    containerStyle={{ marginTop: 16 }}
    placeholder="パスワード"
    leftIcon={{ type: "material", name: "vpn-key" }}
    leftIconContainerStyle={{ paddingRight: 12 }}
  />
);

const SubmitButton = (props: ButtonProps) => (
  <Button
    {...props}
    style={{ marginTop: 48, borderRadius: 8 }}
    title={strings.submit}
    ViewComponent={LinearGradient}
    linearGradientProps={{
      colors: [PRIMARY_ORANGE, STRONG_PINK],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    }}
  />
);

const StyledContainer = styled(Container)`
  padding: 16px;
`;

const StyledCard = styled(Card)`
  padding: 16px;
`;

const StyledTitle = styled(Title)`
  margin-top: 12px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 800;
`;

export default SignInPage;
