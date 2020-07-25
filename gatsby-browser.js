import "ress";
import "./src/styles/global.scss";
import "github-markdown-css";
import "react-toastify/dist/ReactToastify.css";
import "dayjs/locale/ja";

import React from "react";
import LogRocket from "logrocket";
import dayjs from "dayjs";
import mixpanel from "mixpanel-browser";
import setupLogRocketReact from "logrocket-react";
import DarkModeContext from "./src/contexts/DarkModeContext";

export const onClientEntry = () => {
  dayjs.locale("ja");

  LogRocket.init("t4xmlm/kk-web");

  LogRocket.getSessionURL((sessionURL) => {
    mixpanel.track("LogRocket", { sessionURL });
  });

  setupLogRocketReact(LogRocket);
};

export const wrapRootElement = ({ element }) => (
  <DarkModeContext.Provider>{element}</DarkModeContext.Provider>
);
