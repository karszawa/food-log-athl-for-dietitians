import React from "react";
import styled from "styled-components/native";
import { Message } from "../lib/firestore.d";

interface Props {
  message: Message;
}

export const MessageEntry = (props: Props) => {
  const { message } = props;

  return (
    <Container>
      <Text>{message.text}</Text>
    </Container>
  );
};

const Container = styled.View`
  background-color: white;
  border-radius: 8px;
  max-width: 80%;
  padding: 6px 8px;
`;

const Text = styled.Text`
  font-size: 14px;
`;
