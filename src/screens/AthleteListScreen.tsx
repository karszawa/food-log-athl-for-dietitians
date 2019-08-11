import React, { useEffect } from "react";
import {
  NavigationScreenComponent,
  NavigationScreenProp,
  NavigationRoute,
  Header,
} from "react-navigation";
import {
  Container,
  List,
  ListItem,
  Text,
  Content,
  Left,
  Button,
  Body,
  Title,
  Right,
  Icon,
} from "native-base";
import { useSelector, useDispatch } from "react-redux";
import dig from "object-dig";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootState } from "../store";
import { useAuthentication } from "../hooks/useAuthentication";
import { fetchDietitian } from "../store/dietitian/actions";
import { AthleteDetailScreenName } from "../navigation/screen-names";

const useDietitian = (sid: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDietitian());
  }, [sid]);

  return useSelector((state: RootState) => state.dietitian);
};

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

const AthleteListScreen: NavigationScreenComponent = props => {
  const { sid } = useAuthentication(props.navigation);
  const { users: athletes } = useDietitian(sid);

  const listItems = athletes.map(athlete => (
    <StyledListItem key={athlete.id}>
      <TouchableOpacity
        onPress={navigateToAthleteDetail(
          props.navigation,
          athlete.id,
          `${athlete.profile.family_name}${athlete.profile.first_name}`
        )}>
        <AffiliationName>
          {dig(athlete, "profile", "data", "affiliation")}
        </AffiliationName>
        <AthleteName>
          {athlete.profile.family_name} {athlete.profile.first_name}
        </AthleteName>
      </TouchableOpacity>
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
  flex-direction: column;
  align-items: flex-start;
`;

const AffiliationName = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  text-align: left;
`;

const AthleteName = styled(Text)`
  text-align: left;
`;

export default AthleteListScreen;
