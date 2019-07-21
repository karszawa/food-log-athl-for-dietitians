import React, { useEffect } from "react";
import { NavigationScreenComponent } from "react-navigation";
import { Container, List, ListItem, Text } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import dig from "object-dig";
import styled from "styled-components";
import { RootState } from "../store";
import { useAuthentication } from "../hooks/useAuthentication";
import { fetchDietitian } from "../store/dietitian/actions";

const useDietitian = (sid: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDietitian());
  }, [sid]);

  return useSelector((state: RootState) => state.dietitian);
};

const AthleteListScreen: NavigationScreenComponent = props => {
  const { sid } = useAuthentication(props.navigation);
  const { users: athletes } = useDietitian(sid);

  const listItems = athletes.map(athlete => (
    <StyledListItem>
      <Text>
        {athlete.profile.family_name} {athlete.profile.first_name}
      </Text>
      <Text>{dig(athlete, "profile", "data", "affiliation")}</Text>
    </StyledListItem>
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

const StyledListItem = styled(ListItem)`
  flex-direction: column;
`;

export default AthleteListScreen;
