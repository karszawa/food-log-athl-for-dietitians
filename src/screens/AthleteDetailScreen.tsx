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
import { Message, isMessage } from "../lib/firestore.d";
import { Record, isRecord } from "../lib/foolog-api-client.d";
import { RecordEntry } from "../components/RecordEntry";
import { MessageEntry } from "../components/MessageEntry";

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

  return Object.values(
    useSelector((state: RootState) => state.athlete.messages[athleteId] || [])
  ).filter(m => !m.type);
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

  return Object.values(
    useSelector((state: RootState) => state.athlete.records[athleteId] || [])
  );
};

const getDateTime = (obj: Message | Record) => {
  if (isMessage(obj)) {
    return dayjs(obj.ts);
  }

  if (isRecord(obj)) {
    return dayjs(obj.datetime);
  }

  return null;
};

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const athleteId = props.navigation.getParam("athleteId", "");
  const { sid } = useAuthentication(props.navigation);
  const [from, setFrom] = useState(dayjs().subtract(300, "month"));
  const [to, setTo] = useState(dayjs());
  const messages = useAthleteMessages(sid, athleteId);
  const records = useAthleteRecords(sid, athleteId, from, to);
  const entries = ([] as (Message | Record)[])
    .concat(messages)
    .concat(records)
    .sort((a, b) => {
      const at = getDateTime(a) || dayjs();
      const bt = getDateTime(b) || dayjs();
      return at.unix() - bt.unix();
    });

  const entryList = entries.map(entry => {
    const e = isRecord(entry) ? (
      <RecordEntry record={entry} />
    ) : isMessage(entry) ? (
      <MessageEntry message={entry} />
    ) : null;
    return <ListItem key={entry.id}>{e}</ListItem>;
  });

  return (
    <StyledContainer>
      <Content>
        <List>{entryList}</List>
      </Content>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  background-color: #e5e5e5;
`;
