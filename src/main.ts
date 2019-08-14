import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";

import "./polyfills";
import App from "./App";

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App as any);
