import React, { useEffect, useState } from "react";
import { NavigationScreenComponent } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, Text, ListItem, List } from "native-base";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { useAuthentication } from "../hooks/useAuthentication";
import {
  subscribeAthleteMessage,
  fetchAthleteRecords,
} from "../store/athlete/actions";
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

const useAthleteRecords = (
  sid: string,
  athleteId: string,
  from: Dayjs,
  to: Dayjs
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAthleteRecords({
        athleteId,
        from: from.format("YYYY-MM-DD"),
        to: to.format("YYYY-MM-DD"),
      })
    );
  }, [sid, from, to]);

  return useSelector((state: RootState) => state.athlete.records);
};

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const athleteId = props.navigation.getParam("athleteId", "");
  const { sid } = useAuthentication(props.navigation);
  const [from, setFrom] = useState(dayjs().subtract(300, "month"));
  const [to, setTo] = useState(dayjs());
  const messages = useAthleteMessages(sid, athleteId);
  const records = useAthleteRecords(sid, athleteId, from, to);

  const messageList = Object.values(messages).map(message => (
    <StyledListItem key={message.id}>
      <Text>FROM: {message.from}</Text>
      <Text>TEXT: {message.text}</Text>
      <Text>AT: {formatRelativeDateTime(dayjs(message.ts))}</Text>
    </StyledListItem>
  ));

  const recordsList = Object.values(records).map(record => (
    <ListItem key={record.id}>
      <Text>{record.id}</Text>
    </ListItem>
  ));

  return (
    <Container>
      <Content>
        <List>{recordsList}</List>
        <List>{messageList}</List>
      </Content>
    </Container>
  );
};

const StyledListItem = styled(ListItem)`
  flex-direction: column;
  justify-content: flex-start;
`;
