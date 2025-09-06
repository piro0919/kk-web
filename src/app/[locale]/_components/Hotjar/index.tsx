"use client";
import env from "@/env";
import { Fragment, useEffect } from "react";

export default function Hotjar(): React.JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    let isLoaded = false;

    const loadHotjar = async (): Promise<void> => {
      if (isLoaded) return;
      isLoaded = true;

      const { hotjar } = await import("react-hotjar");

      hotjar.initialize({
        id: parseInt(env.NEXT_PUBLIC_HOTJAR_ID, 10),
        sv: parseInt(env.NEXT_PUBLIC_HOTJAR_SV, 10),
      });
    };
    // Load after user interaction (click, scroll, touch)
    const handleUserInteraction = (): void => {
      setTimeout(() => {
        void loadHotjar();
      }, 2500);

      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // Add event listeners for user interactions
    document.addEventListener("click", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("scroll", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });

    // Cleanup
    return (): void => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  return <Fragment />;
}
