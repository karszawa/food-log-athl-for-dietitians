import React, { useState, useCallback } from "react";
import { Input, Button } from "react-native-elements";
import { NavigationScreenComponent } from "react-navigation";
import styled from "styled-components/native";
import { Title, Card } from "native-base";
import { Container } from "../styles/layout";
import { signIn } from "../slices/auth";

const strings = {
  title: "FoodLog Athl",
  guideText: `サインイン`,
};

interface Params {}

interface Props {}

const SignInPage: NavigationScreenComponent<Params, {}, Props> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onPressSubmitButton = useCallback(() => {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    signIn({ username, password });
  }, [username, password]);

  return (
    <StyledContainer>
      <StyledCard>
        <StyledTitle>{strings.guideText}</StyledTitle>
        <UserNameInput value={username} onChangeText={setUsername} />
        <PasswordInput value={password} onChangeText={setPassword} />
        <SubmitButton onPress={onPressSubmitButton} />
      </StyledCard>
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
