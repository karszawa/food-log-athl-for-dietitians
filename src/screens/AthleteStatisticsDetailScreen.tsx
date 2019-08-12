import { Container, ListItem, Text, Right, Left } from "native-base";
import React from "react";
import { FlatList, NavigationScreenComponent } from "react-navigation";
import dayjs from "dayjs";
import { useAuthentication } from "../hooks/useAuthentication";
import { useStatistics } from "../hooks/useStatistics";

const constants = {
  weight: {
    title: "体重",
    unit: "kg",
  },
};

interface Params {
  athleteId: string;
  type: "weight";
}

export const AthleteStatisticsDetailScreen: NavigationScreenComponent<
  Params
> = props => {
  const { navigation } = props;
  const { sid } = useAuthentication(navigation);
  const type = navigation.getParam("type");

  // TODO: Switch by params
  // TODO: Implement fetchMore
  const { weight } = useStatistics(sid, props.navigation.getParam("athleteId"));

  return (
    <Container>
      <FlatList
        data={weight.reverse()}
        renderItem={renderItem(constants[type].unit)}
        keyExtractor={e => e.datetime}
      />
    </Container>
  );
};

AthleteStatisticsDetailScreen.navigationOptions = ({ navigation }) => ({
  title: constants[navigation.getParam("type")].title,
});

const renderItem = (unit: string) => ({
  item,
}: {
  item: {
    value: number;
    datetime: string;
  };
}) => (
  <ListItem>
    <Left>
      <Text>{dayjs(item.datetime).format("YYYY年M月D日")}</Text>
    </Left>
    <Right>
      <Text>
        {item.value} {unit}
      </Text>
    </Right>
  </ListItem>
);
