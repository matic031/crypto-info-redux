import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import {Provider} from "react-redux";

import App from "./App";
import store from './app/store'

ReactDOM.render(
  <Router>
    {/* <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    > */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </ConfigProvider> */}
  </Router>,
  document.getElementById("root")
);
