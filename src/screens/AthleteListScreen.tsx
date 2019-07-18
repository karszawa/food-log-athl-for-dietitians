import React from "react";
import { NavigationScreenComponent } from "react-navigation";
import { Container, List, ListItem, Text } from "native-base";

const useAthletes = () => {
  return {
    athletes: [],
  };
};

const AthleteListScreen: NavigationScreenComponent = () => {
  const { athletes } = useAthletes();

  const listItems = athletes.map(athlete => (
    <ListItem>
      <Text>{athlete.name}</Text>
      <Text>{athlete.affirmation}</Text>
    </ListItem>
  ));

  return (
    <Container>
      <List>{listItems}</List>
    </Container>
  );
};

AthleteListScreen.navigationOptions = {
  title: "選手一覧",
};

export default AthleteListScreen;
