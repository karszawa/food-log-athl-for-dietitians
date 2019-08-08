import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components/native";
import { Input, Icon, Footer } from "native-base";
import {
  TouchableOpacity,
  GestureResponderEvent,
  KeyboardAvoidingView,
  NativeModules,
  StatusBarIOS,
} from "react-native";
import { Platform } from "@unimodules/core";
import { GRAY_C, PRIMARY_PINK } from "../styles/color";

const { StatusBarManager } = NativeModules;

interface Props {
  onSubmit: (text: string) => boolean;
}

const useStatusBarHeight = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === "ios") {
      StatusBarManager.getHeight(statusBarFrameData => {
        setStatusBarHeight(statusBarFrameData.height);
      });

      const statusBarListener = StatusBarIOS.addListener(
        "statusBarFrameWillChange",
        statusBarData => {
          setStatusBarHeight(statusBarData.frame.height);
        }
      );

      return () => {
        statusBarListener.remove();
      };
    }
  });

  return statusBarHeight;
};

export const CommentBox: React.FC<Props> = ({ onSubmit }) => {
  const statusBarHeight = useStatusBarHeight();
  const [text, setText] = useState("");
  const handleSubmit = useCallback(() => {
    if (text) {
      if (onSubmit(text)) {
        setText("");
      }
    }
  }, [text]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={44 + statusBarHeight}
      style={{ width: "100%" }}>
      <Footer>
        <InputContainer>
          <StyledInput placeholder="メッセージを送る" onChangeText={setText} />
          <SendButton onPress={handleSubmit} disabled={text.length === 0} />
        </InputContainer>
      </Footer>
    </KeyboardAvoidingView>
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
