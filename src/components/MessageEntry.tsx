import React from "react";
import styled from "styled-components/native";
import { Message } from "../lib/firestore-types";

interface Props {
  message: Message;
  athleteId: string;
}

export const MessageEntry = (props: Props) => {
  const { message, athleteId } = props;
  const isFromAthlete = message.from === athleteId;

  return (
    <Container isFromAthlete={isFromAthlete}>
      <Text>{message.text}</Text>
    </Container>
  );
};

interface ContainerProps {
  isFromAthlete: boolean;
}

const Container = styled.View`
  background-color: white;
  border-radius: 8px;
  max-width: 80%;
  padding: 6px 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  ${(props: ContainerProps) =>
    props.isFromAthlete ? "margin-right: auto;" : "margin-left: auto;"}
`;

const Text = styled.Text`
  font-size: 14px;
`;
