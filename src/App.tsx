import React, { useState, useCallback } from "react";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import { loadAsync } from "expo-font";
import Navigator from "./navigation";
import { createStore } from "./store";

const store = createStore();

export default () => {
  const { isReady, finish, setup } = useSetup();

  if (!isReady) {
    return <AppLoading startAsync={setup} onFinish={finish} />;
  }

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
};

const useSetup = () => {
  const [isReady, setIsReady] = useState(false);
  const setup = async () =>
    await loadAsync({
      Roboto: require("../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../node_modules/native-base/Fonts/Roboto_medium.ttf"),
    });
  const finish = useCallback(() => {
    setIsReady(true);
  }, [setIsReady]);

  return {
    isReady,
    finish,
    setup,
  };
};
