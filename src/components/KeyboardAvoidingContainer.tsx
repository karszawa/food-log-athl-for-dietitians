import React from "react";
import { KeyboardAvoidingView } from "react-native";
import Constants from "expo-constants";

interface Props {
  keyboardVerticalOffset: number;
}

export const KeyboardAvoidingContainer: React.FC<Props> = ({
  children,
  keyboardVerticalOffset,
}) => {
  const platformHeight = Constants.platform.ios ? 0 : 25;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset + platformHeight}>
      {children}
    </KeyboardAvoidingView>
  );
};
