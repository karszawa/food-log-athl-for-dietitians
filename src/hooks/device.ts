import { NativeModules, Platform, StatusBarIOS } from "react-native";
import { useState, useEffect } from "react";

const { StatusBarManager } = NativeModules;

export const useStatusBarHeight = () => {
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
