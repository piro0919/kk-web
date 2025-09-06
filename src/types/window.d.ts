/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line filenames/match-regex
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};
