"use client";
import env from "@/env";
import { Fragment, useEffect } from "react";
import { hotjar } from "react-hotjar";

export default function Hotjar(): React.JSX.Element {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_HOTJAR_ID || !env.NEXT_PUBLIC_HOTJAR_SV) {
      return;
    }

    hotjar.initialize({
      id: parseInt(env.NEXT_PUBLIC_HOTJAR_ID, 10),
      sv: parseInt(env.NEXT_PUBLIC_HOTJAR_SV, 10),
    });
  }, []);

  return <Fragment />;
}
