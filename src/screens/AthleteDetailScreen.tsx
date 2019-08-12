import dayjs, { Dayjs } from "dayjs";
import { Container, Footer, ListItem } from "native-base";
import React from "react";
import { View } from "react-native";
import { FlatList, NavigationScreenComponent } from "react-navigation";
import styled from "styled-components/native";
import { CommentBox } from "../components/CommentBox";
import { KeyboardAvoidingContainer } from "../components/KeyboardAvoidingContainer";
import { MessageEntry } from "../components/MessageEntry";
import { RecordEntry } from "../components/RecordEntry";
import { useAuthentication } from "../hooks/useAuthentication";
import { Entry, useEntries } from "../hooks/useEntry";
import { useMessage } from "../hooks/useMessage";
import { useScrollToEnd } from "../hooks/useScrollToEnd";
import { isMessage } from "../lib/firestore.d";
import { isRecord } from "../lib/foolog-api-client.d";
import ThemeVariables from "../native-base-theme/variables/platform.js";

interface Params {
  athleteId: string;
}

export const AthleteDetailScreen: NavigationScreenComponent<Params> = props => {
  const athleteId = props.navigation.getParam("athleteId", "");
  const { sid } = useAuthentication(props.navigation);
  const { sendMessage } = useMessage(sid, athleteId);
  const { entries, fetchMore, refreshing } = useEntries(sid, athleteId);
  const { ref: listRef, scrollToEnd } = useScrollToEnd<FlatList<ItemT>>();

  return (
    <StyledContainer>
      <KeyboardAvoidingContainer
        keyboardVerticalOffset={ThemeVariables.footerHeight}>
        <FlatList
          ref={listRef}
          data={entries}
          renderItem={renderItem(athleteId)}
          keyExtractor={item => item[0]}
          refreshing={refreshing}
          onRefresh={fetchMore}
          onContentSizeChange={scrollToEnd}
        />
        <StyledFooter>
          <CommentBox onSubmit={sendMessage} />
        </StyledFooter>
      </KeyboardAvoidingContainer>
    </StyledContainer>
  );
};

AthleteDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("name"),
});

type ItemT = [string, Entry[]];

const renderItem = (athleteId: string) => ({ item }: { item: ItemT }) => {
  const [date, entries] = item;
  const entryComponents = entries
    .map(entry =>
      isRecord(entry) ? (
        <RecordEntry key={entry.id} athleteId={athleteId} record={entry} />
      ) : isMessage(entry) ? (
        <MessageEntry key={entry.id} message={entry} athleteId={athleteId} />
      ) : null
    )
    .filter(Boolean);

  return (
    <StyledListItem>
      <View style={{ flex: 1, width: "100%" }}>
        <DateSeparator date={dayjs(date)} />
        {entryComponents}
      </View>
    </StyledListItem>
  );
};

const StyledContainer = styled(Container)`
  background-color: #f5f5f5;
  padding-top: 0;
  padding-bottom: 0;
`;

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;
  flex-direction: column;
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
