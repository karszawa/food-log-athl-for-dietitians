import React, { useEffect, useState } from "react";
import { NavigationScreenComponent, FlatList } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, ListItem, Footer, Input } from "native-base";
import styled from "styled-components/native";
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
import { CommentBox } from "../components/CommentBox";

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

const useEntries = (sid: string, athleteId: string, from: Dayjs, to: Dayjs) => {
  const messages = useAthleteMessages(sid, athleteId);
  const records = useAthleteRecords(sid, athleteId, from, to);

  // MEMO: 日毎の食事記録をソートされた配列としてまとめる
  const groups = ([] as (Message | Record)[])
    .concat(messages)
    .concat(records)
    .reduce((groups, entry) => {
      const currTsFmt = getDateTime(entry).format("YYYY/MM/DD");

      if (!groups[currTsFmt]) {
        groups[currTsFmt] = [];
      }

      groups[currTsFmt] = groups[currTsFmt].concat(entry);

      return groups;
    }, {});

  // MEMO: 日毎にまとめやセパレータを挿入しつつFlattenする
  return Object.entries(groups)
    .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0])))
    .reduce(
      (entries, pair) => {
        const date = dayjs(pair[0]);
        const dateSeparator: DateSeparator = {
          separator: true,
          date,
          id: date.toISOString(),
        };
        const dayEntries: (Record | Message)[] = pair[1] as any;

        return [...entries, dateSeparator, ...dayEntries];
      },
      [] as (Message | Record)[]
    );
};

interface DateSeparator {
  separator: boolean;
  date: Dayjs;
  id: string;
}

const isSeparator = (obj: any): obj is DateSeparator => {
  return Boolean(obj.separator);
};

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const athleteId = props.navigation.getParam("athleteId", "");
  const { sid } = useAuthentication(props.navigation);
  const [from, setFrom] = useState(dayjs().subtract(300, "month"));
  const [to, setTo] = useState(dayjs());
  const entries = useEntries(sid, athleteId, from, to);

  const renderItem = ({ item }: { item: Message | Record | DateSeparator }) => {
    if (isSeparator(item)) {
      return <DateSeparator date={item.date} />;
    }

    const e = isRecord(item) ? (
      <RecordEntry record={item} />
    ) : isMessage(item) ? (
      <MessageEntry message={item} athleteId={athleteId} />
    ) : null;

    return <StyledListItem>{e}</StyledListItem>;
  };

  return (
    <StyledContainer>
      <Content>
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </Content>

      <CommentBox
        onSubmit={text => {
          alert(text);
          return true;
        }}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  background-color: #f5f5f5;
`;

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;
`;

const DateSeparator = (props: { date: Dayjs }) => {
  return (
    <DateSeparatorContainer>
      <DateSeparatorBar />
      <DateSeparatorText>{props.date.format("YYYY/MM/DD")}</DateSeparatorText>
      <DateSeparatorBar />
    </DateSeparatorContainer>
  );
};

const DateSeparatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px;
`;

const DateSeparatorBar = styled.View`
  flex: 1;
  height: 1px;
  border-top-width: 1px;
  border-top-color: #ddd;
  margin: 0 2px;
`;

const DateSeparatorText = styled.Text`
  font-size: 12px;
  color: #999;
  margin: 0 2px;
`;
