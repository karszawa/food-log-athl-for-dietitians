import React from "react";
import { Container, Text } from "native-base";
import { NavigationScreenComponent } from "react-navigation";

const Home: NavigationScreenComponent = () => (
  <Container>
    <Text>Yo</Text>
  </Container>
);

Home.navigationOptions = {
  title: "Home",
};

export default Home;
