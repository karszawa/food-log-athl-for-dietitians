import React, { useState, useCallback } from "react";
import { Input, Button, Text } from "react-native-elements";
import { NavigationScreenComponent } from "react-navigation";
import { Container } from "../styles/layout";
import { signIn } from "../slices/auth";

const strings = {
  guideText: `"FLAD: FoodLog Athl for Dietitians" は FoodLog Athl の管理栄養士向けアプリです。ご利用登録はWebサイトからお申し込みください。`,
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
    <Container style={{ padding: 16 }}>
      <Text>{strings.guideText}</Text>
      <UserNameInput value={username} onChangeText={setUsername} />
      <PasswordInput value={password} onChangeText={setPassword} />
      <SubmitButton onPress={onPressSubmitButton} />
    </Container>
  );
};

SignInPage.navigationOptions = {
  title: "Sign In",
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
  <Button {...props} style={{ marginTop: 64 }} title="Submit" />
);

export default SignInPage;
