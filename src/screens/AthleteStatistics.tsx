import {
  Container,
  List,
  ListItem,
  Text,
  Left,
  Right,
  Icon,
} from "native-base";
import React from "react";
import { NavigationScreenComponent } from "react-navigation";
import { last, get } from "lodash-es";
import { useAuthentication } from "../hooks/useAuthentication";
import { useStatistics } from "../hooks/useStatistics";

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
  const { weight } = useStatistics(
    sid,
    props.navigation.getParam("athleteId", "")
  );

  const lastWeight = get(last(weight), "value");

  return (
    <Container>
      <ListItem itemDivider>
        <Text>{strings.bodyCompositionTitle}</Text>
      </ListItem>
      <List>
        <ListItem>
          <Left>
            <Text>{strings.bodyWeightTitle}</Text>
          </Left>
          {lastWeight ? (
            <Right style={styles.valueContainer}>
              <Text>{lastWeight} kg</Text>
              <Icon name="chevron-small-right" type="Entypo" />
            </Right>
          ) : (
            <Right>
              <Text note>登録なし</Text>
            </Right>
          )}
        </ListItem>
        <ListItem>
          <Left>
            <Text>{strings.fatPercentageTitle}</Text>
          </Left>
          <Right>
            <Text note>登録なし</Text>
          </Right>
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

const styles = {
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
} as const;
