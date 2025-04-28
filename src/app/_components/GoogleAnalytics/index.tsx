"use client";
import {
  GoogleAnalytics as GoogleAnalyticsComponent,
  usePageViews,
} from "nextjs-google-analytics";
import env from "@/env";

export default function GoogleAnalytics(): JSX.Element {
  usePageViews({ gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID });

  return <GoogleAnalyticsComponent trackPageViews={true} />;
}
