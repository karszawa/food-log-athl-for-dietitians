import React from "react";
import { Provider } from "react-redux";
import Navigation from "./navigation";
import { createStore } from "./store";

const store = createStore();

const App: React.FC<{}> = () => (
  <Provider store={store}>
    <Navigation />
  </Provider>
);

export default App;
