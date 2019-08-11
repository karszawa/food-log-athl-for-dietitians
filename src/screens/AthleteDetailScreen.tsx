import React, { useEffect, useCallback, useRef, useState } from "react";
import { NavigationScreenComponent, FlatList } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { Container, Content, ListItem, Footer } from "native-base";
import styled from "styled-components/native";
import dayjs, { Dayjs } from "dayjs";
import { useAuthentication } from "../hooks/useAuthentication";
import { publishMessage, fetchLatestRecords } from "../store/athlete/actions";
import { RootState } from "../store";
import { Message, isMessage } from "../lib/firestore.d";
import { Record, isRecord } from "../lib/foolog-api-client.d";
import { RecordEntry } from "../components/RecordEntry";
import { MessageEntry } from "../components/MessageEntry";
import { CommentBox } from "../components/CommentBox";
import { KeyboardAvoidingContainer } from "../components/KeyboardAvoidingContainer";
import ThemeVariables from "../native-base-theme/variables/platform.js";

interface Params {
  athleteId: string;
}

// const useAthleteMessages = (sid: string, athleteId: string) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(subscribeAthleteMessage({ athleteId }));

//     return () => {
//       // TODO: Unsubscribe athlete messages
//     };
//   }, [sid, athleteId]);

//   return Object.values(
//     useSelector((state: RootState) => state.athlete.messages[athleteId] || [])
//   ).filter(m => !m.type);
// };

// const useAthleteRecords = (
//   sid: string,
//   athleteId: string,
// ) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(
//       fetchAthleteRecords({
//         athleteId,
//         from: from.format("YYYY-MM-DD"),
//         to: to.format("YYYY-MM-DD"),
//       })
//     );
//   }, [sid, from, to]);

//   return Object.values(
//     useSelector((state: RootState) => state.athlete.records[athleteId] || [])
//   );
// };

const getDateTime = (obj: Message | Record) => {
  if (isMessage(obj)) {
    return dayjs(obj.ts);
  }

  if (isRecord(obj)) {
    return dayjs(obj.datetime);
  }

  return null;
};

const useEntries = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLatestRecords({ athleteId, count: 14 /* 2w */ }));
  }, [sid, dispatch, athleteId]);

  const fetchMore = useCallback(() => {
    dispatch(fetchLatestRecords({ athleteId, count: 14 /* 2w */ }));
  }, [dispatch, athleteId]);
  const records = Object.values(
    useSelector((state: RootState) => state.athlete.records[athleteId] || [])
  );
  const messages = Object.values(
    useSelector((state: RootState) => state.athlete.messages[athleteId] || [])
  ).filter(m => !m.type);

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
  const entries = Object.entries(groups)
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

  const { processing } = useSelector((state: RootState) => state.athlete);

  return {
    fetchMore,
    entries,
    refreshing: processing,
  };
};

const usePublishMessage = (sid: string, athleteId: string) => {
  const dispatch = useDispatch();

  return useCallback(
    text => {
      dispatch(publishMessage({ athleteId, text }));
    },
    [sid]
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

type ItemT = Message | Record | DateSeparator;

const useScrollToEnd = () => {
  const listRef = useRef<FlatList<ItemT>>();
  const [mountedAt] = useState(dayjs());
  const scrollToEnd = useCallback(() => {
    if (listRef.current && dayjs().diff(mountedAt, "second") < 2) {
      listRef.current.scrollToEnd({ animated: false });
    }
  }, [listRef]);

  return {
    scrollToEnd,
    ref: listRef,
  };
};

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const athleteId = props.navigation.getParam("athleteId", "");
  const { sid } = useAuthentication(props.navigation);
  const publishMessage = usePublishMessage(sid, athleteId);
  const { entries, fetchMore, refreshing } = useEntries(sid, athleteId);
  const { ref: listRef, scrollToEnd } = useScrollToEnd();

  const renderItem = ({ item }: { item: ItemT }) => {
    if (isSeparator(item)) {
      return <DateSeparator date={item.date} />;
    }

    const e = isRecord(item) ? (
      <RecordEntry athleteId={athleteId} record={item} />
    ) : isMessage(item) ? (
      <MessageEntry message={item} athleteId={athleteId} />
    ) : null;

    return <StyledListItem>{e}</StyledListItem>;
  };

  return (
    <StyledContainer>
      <KeyboardAvoidingContainer
        keyboardVerticalOffset={ThemeVariables.footerHeight}>
        <FlatList
          ref={listRef}
          data={entries}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={fetchMore}
          onContentSizeChange={scrollToEnd}
        />
        <StyledFooter>
          <CommentBox onSubmit={publishMessage} />
        </StyledFooter>
      </KeyboardAvoidingContainer>
    </StyledContainer>
  );
};

AthleteDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("name"),
});

const StyledContainer = styled(Container)`
  background-color: #f5f5f5;
`;

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;
`;

const StyledFooter = styled(Footer)`
  background-color: #f8f8f8;
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
