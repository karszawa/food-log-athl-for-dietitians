import React, { useState, useCallback, useEffect } from "react";
import { Input, Button, ButtonProps } from "react-native-elements";
import {
  NavigationScreenComponent,
  NavigationRoute,
  NavigationScreenProp,
} from "react-navigation";
import styled from "styled-components/native";
import { Title, Card } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Container } from "../styles/layout";
import { trySignIn, restoreSession } from "../store/auth/actions";
import { RootState } from "../store";
import { OverlayLoading } from "../components/Loading";
import { AthleteListScreenName } from "../navigation/screen-names";
import { PRIMARY_PINK } from "../styles/color";

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
          <SubmitButton onPress={onPressSubmitButton} />
        </StyledCard>
      </StyledContainer>
      <OverlayLoading isVisible={processing} />
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
      colors: ["#e98954", "#e954b5"],
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
