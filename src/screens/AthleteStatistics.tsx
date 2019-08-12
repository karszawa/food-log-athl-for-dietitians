import React from "react";
import { NavigationScreenComponent } from "react-navigation";
import { Container, List, ListItem, Text } from "native-base";
import { useAuthentication } from "../hooks/useAuthentication";

const strings = {
  bodyCompositionTitle: "体組成値",
  bodyWeightTitle: "体重",
  fatPercentageTitle: "体脂肪率",
  nutritionTitle: "栄養素",
};

interface Params {
  athleteId: string;
}

export const AthleteStatisticsScreen: NavigationScreenComponent<
  Params
> = props => {
  const { sid } = useAuthentication(props.navigation);

  return (
    <Container>
      <ListItem itemDivider>
        <Text>{strings.bodyCompositionTitle}</Text>
      </ListItem>
      <List>
        <ListItem>
          <Text>{strings.bodyWeightTitle}</Text>
        </ListItem>
        <ListItem>
          <Text>{strings.fatPercentageTitle}</Text>
        </ListItem>
      </List>
      <ListItem itemDivider>
        <Text>{strings.nutritionTitle}</Text>
      </ListItem>
      <ListItem>
        <Text>エネルギー・タンパク質等の変化を確認できるようになる</Text>
      </ListItem>
    </Container>
  );
};
