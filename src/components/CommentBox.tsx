import React, { useState, useCallback } from "react";
import styled from "styled-components/native";
import { Input, Icon } from "native-base";
import { TouchableOpacity, GestureResponderEvent } from "react-native";
import { GRAY_C } from "../styles/color";

interface Props {
  onSubmit: (text: string) => void;
}

export const CommentBox: React.FC<Props> = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const handleSubmit = useCallback(() => {
    if (text) {
      onSubmit(text);
      setText("");
    }
  }, [text]);

  return (
    <InputContainer>
      <StyledInput
        placeholder="メッセージを送る"
        onChangeText={setText}
        value={text}
      />
      <SendButton onPress={handleSubmit} disabled={text.length === 0} />
    </InputContainer>
  );
};

const InputContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px 12px;
  flex: 1;
`;

const StyledInput = styled(Input)`
  background-color: #f1f1f1;
  border-radius: 6px;
  height: 32px;
  flex-grow: 1;
  padding: 0 16px;
`;

interface SendButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
}

const SendButton = ({ onPress, disabled }: SendButtonProps) => (
  <IconContainer>
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Icon
        type="FontAwesome"
        name="paper-plane"
        style={{ fontSize: 18, color: disabled ? GRAY_C : "#16ab95" }}
      />
    </TouchableOpacity>
  </IconContainer>
);

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 0 10px 0 16px;
`;
