"use client";
import LogRocketComponent from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { Fragment, useEffect } from "react";
import env from "@/env";

export default function LogRocket(): JSX.Element {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_LOG_ROCKET_APP_ID) {
      return;
    }

    LogRocketComponent.init(env.NEXT_PUBLIC_LOG_ROCKET_APP_ID);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setupLogRocketReact(LogRocketComponent);
  }, []);

  return <Fragment />;
}
