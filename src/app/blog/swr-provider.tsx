// eslint-disable-next-line filenames/match-regex
"use client";
import { type ReactNode } from "react";
import { SWRConfig } from "swr";

export type SWRProviderProps = {
  children: ReactNode;
  fallbackData: unknown;
};

export default function SWRProvider({
  children,
  fallbackData,
}: SWRProviderProps): React.JSX.Element {
  return <SWRConfig value={{ fallbackData }}>{children}</SWRConfig>;
}
