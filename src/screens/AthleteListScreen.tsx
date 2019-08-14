import { get } from "lodash-es";
import {
  Body,
  Button,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Text,
} from "native-base";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  NavigationRoute,
  NavigationScreenComponent,
  NavigationScreenProp,
} from "react-navigation";
import styled from "styled-components/native";
import { useAuthentication } from "../hooks/useAuthentication";
import { AthleteDetailScreenName } from "../navigation/screen-names";
import { useDietitian } from "../hooks/useDietitian";

const navigateToAthleteDetail = (
  navigation: NavigationScreenProp<NavigationRoute>,
  athleteId: string,
  name: string
) => () => {
  navigation.navigate(AthleteDetailScreenName, {
    athleteId,
    name,
  });
};

export const AthleteListScreen: NavigationScreenComponent = props => {
  const { sid } = useAuthentication(props.navigation);
  const { users: athletes } = useDietitian(sid);

  const listItems = athletes.map(athlete => (
    <StyledListItem
      key={athlete.id}
      onPress={navigateToAthleteDetail(
        props.navigation,
        athlete.id,
        `${athlete.profile.family_name}${athlete.profile.first_name}`
      )}>
      <Body>
        <AffiliationName>
          {get(athlete, "profile.data.affiliation", "所属なし")}
        </AffiliationName>
        <AthleteName>
          {athlete.profile.family_name} {athlete.profile.first_name}
        </AthleteName>
      </Body>
    </StyledListItem>
  ));

  return (
    <Container>
      <Content>
        <List>{listItems}</List>
      </Content>
    </Container>
  );
};

AthleteListScreen.navigationOptions = ({ navigation }) => ({
  title: "選手一覧",
  headerLeft: (
    <Button transparent onPress={() => navigation.openDrawer()}>
      <Icon name="menu" style={{ color: "white" }} />
    </Button>
  ),
});

const StyledListItem = styled(ListItem)`
  width: 100%;
`;

const AffiliationName = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  width: 100%;
`;

const AthleteName = styled(Text)`
  font-size: 18px;
  width: 100%;
  text-align: left;
`;
