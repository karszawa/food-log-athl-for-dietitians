import React, { useEffect } from "react";
import { NavigationScreenComponent } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Text, ListItem, List } from "native-base";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAuthentication } from "../hooks/useAuthentication";
import { subscribeAthleteMessage } from "../store/athlete/actions";
import { RootState } from "../store";
import { formatRelativeDateTime } from "../lib/datetime";

interface Params {
  athleteId: string;
}

const useAthleteMessages = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeAthleteMessage({ athleteId }));

    return () => {
      // TODO: Unsubscribe athlete messages
    };
  }, [sid, athleteId]);

  return useSelector(
    (state: RootState) => state.athlete.messages[athleteId] || {}
  );
};

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const { sid } = useAuthentication(props.navigation);
  const messages = useAthleteMessages(
    sid,
    props.navigation.getParam("athleteId", "")
  );
  const messageList = Object.values(messages).map(message => (
    <StyledListItem>
      <Text>FROM: {message.from}</Text>
      <Text>TEXT: {message.text}</Text>
      <Text>AT: {formatRelativeDateTime(dayjs(message.ts))}</Text>
    </StyledListItem>
  ));

  return (
    <Container>
      <Content>
        <List>{messageList}</List>
      </Content>
    </Container>
  );
};

const StyledListItem = styled(ListItem)`
  flex-direction: column;
  justify-content: flex-start;
`;
