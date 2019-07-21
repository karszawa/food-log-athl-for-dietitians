import React, { useState, useCallback, useEffect } from "react";
import { Input, Button } from "react-native-elements";
import {
  NavigationScreenComponent,
  NavigationRoute,
  NavigationScreenProp,
} from "react-navigation";
import styled from "styled-components/native";
import { Title, Card } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../styles/layout";
import { trySignIn, restoreSession } from "../store/auth/actions";
import { RootState } from "../store";
import { OverlayLoading } from "../components/Loading";
import { AthleteListScreenName } from "../navigation/screen-names";

const strings = {
  title: "FoodLog Athl",
  guideText: `サインイン`,
};

interface Params {}

interface Props {}

const SignInPage: NavigationScreenComponent<Params, {}, Props> = props => {
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
  useRouter({ navigation: props.navigation });

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

  if (authenticated) {
    navigation.navigate(AthleteListScreenName);
  }
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

const SubmitButton = (props: any) => (
  <Button {...props} style={{ marginTop: 48 }} title="Submit" />
);

const StyledContainer = styled(Container)`
  padding: 16px;
`;

const StyledCard = styled(Card)`
  padding: 16px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 24px;
`;

export default SignInPage;
