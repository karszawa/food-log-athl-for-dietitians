import React, { useState, useCallback, useEffect } from "react";
import { Input, Button, Text } from "react-native-elements";
import { NavigationScreenComponent } from "react-navigation";
import styled from "styled-components/native";
import { Title, Card } from "native-base";
import { useSelector } from "react-redux";
import { Container } from "../styles/layout";
import { signIn, restoreSession } from "../slices/auth";
import { RootState } from "../slices/store";
import { OverlayLoading } from "../components/Loading";
import { HomeScreenId } from "../navigation/screen-names";

const strings = {
  title: "FoodLog Athl",
  guideText: `サインイン`,
};

interface Params {}

interface Props {}

const SignInPage: NavigationScreenComponent<Params, {}, Props> = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onPressSubmitButton = useCallback(() => {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    signIn({ username, password });
  }, [username, password]);
  useEffect(() => {
    restoreSession();
  });
  const { processing, errors, authenticated } = useSelector(
    (state: RootState) => state.auth
  );
  if (authenticated) {
    props.navigation.navigate(HomeScreenId);
  }

  return (
    <StyledContainer>
      <StyledCard>
        <StyledTitle>{strings.guideText}</StyledTitle>
        <UserNameInput value={username} onChangeText={setUsername} />
        {errors && errors.username && <Text>ユーザー名が間違っています</Text>}
        <PasswordInput value={password} onChangeText={setPassword} />
        {errors && errors.password && <Text>パスワードが間違っています</Text>}
        <SubmitButton onPress={onPressSubmitButton} />
      </StyledCard>

      {processing && <OverlayLoading />}
    </StyledContainer>
  );
};

SignInPage.navigationOptions = {
  title: strings.title,
};

const UserNameInput = (props: any) => (
  <Input
    {...props}
    containerStyle={{ marginTop: 4 }}
    placeholder="User Name"
    leftIcon={{ type: "material", name: "person" }}
    leftIconContainerStyle={{ paddingRight: 12 }}
  />
);

const PasswordInput = (props: any) => (
  <Input
    {...props}
    secureTextEntry
    containerStyle={{ marginTop: 16 }}
    placeholder="Password"
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
