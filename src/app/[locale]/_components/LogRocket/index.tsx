"use client";
import env from "@/env";
import _LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { Fragment, useEffect } from "react";

export default function LogRocket(): React.JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    _LogRocket.init(env.NEXT_PUBLIC_LOG_ROCKET_APP_ID);

    setupLogRocketReact(_LogRocket);
  }, []);

  return <Fragment />;
}
