"use client";
import env from "@/env";
import LogRocketComponent from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { Fragment, useEffect } from "react";

export default function LogRocket(): React.JSX.Element {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_LOG_ROCKET_APP_ID) {
      return;
    }

    LogRocketComponent.init(env.NEXT_PUBLIC_LOG_ROCKET_APP_ID);

    setupLogRocketReact(LogRocketComponent);
  }, []);

  return <Fragment />;
}
