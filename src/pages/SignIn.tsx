import React from "react";
import { Text } from "react-native-elements";
import { Container } from "../styles/layout";

class SignInPage extends React.Component<{}, {}> {
  static navigationOptions = {
    title: "Sign In",
  };

  render() {
    return (
      <Container>
        <Text h1>Sign In</Text>
      </Container>
    );
  }
}

export default SignInPage;
