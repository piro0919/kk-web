"use client";
import env from "@/env";
import { Fragment, useEffect } from "react";

export default function GoogleAnalytics(): React.JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    let isLoaded = false;

    const loadGoogleAnalytics = async (): Promise<void> => {
      if (isLoaded) return;
      isLoaded = true;

      // Dynamically load gtag script
      const script = document.createElement("script");

      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${env.GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag after script loads
      script.onload = (): void => {
        window.dataLayer = window.dataLayer || [];

        window.gtag = function gtag(): void {
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer.push(arguments);
        };

        window.gtag("js", new Date());
        window.gtag("config", env.GA_MEASUREMENT_ID, {
          page_location: window.location.href,
          page_title: document.title,
        });
      };
    };
    // Load after user interaction (click, scroll, touch)
    const handleUserInteraction = (): void => {
      setTimeout(() => {
        void loadGoogleAnalytics();
      }, 2000);

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
