import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { useStatusBarHeight } from "../hooks/device";

export const KeyboardAvoidingContainer: React.FC<{}> = ({ children }) => {
  const statusBarHeight = useStatusBarHeight();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={44 + statusBarHeight}>
      {children}
    </KeyboardAvoidingView>
  );
};
