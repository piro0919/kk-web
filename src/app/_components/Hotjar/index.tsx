"use client";
import { Fragment, useEffect } from "react";
import { hotjar } from "react-hotjar";
import env from "@/env";

export default function Hotjar(): JSX.Element {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_HOTJAR_ID || !env.NEXT_PUBLIC_HOTJAR_SV) {
      return;
    }

    hotjar.initialize(
      parseInt(env.NEXT_PUBLIC_HOTJAR_ID, 10),
      parseInt(env.NEXT_PUBLIC_HOTJAR_SV, 10),
    );
  }, []);

  return <Fragment />;
}
