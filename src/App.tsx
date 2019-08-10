import React, { useState, useCallback } from "react";
import { Provider } from "react-redux";
import { AppLoading, Font } from "expo";
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
  const setup = Font.loadAsync({
    Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
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
