// eslint-disable-next-line filenames/match-regex
"use client";
import { type ReactNode } from "react";
import { SWRConfig } from "swr";

export type SWRProviderProps = {
  children: ReactNode;
  fallback: undefined | { [key: string]: unknown };
};

export default function SWRProvider({
  children,
  fallback,
}: SWRProviderProps): React.JSX.Element {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
