"use client";
import env from "@/env";
import {
  GoogleAnalytics as GoogleAnalyticsComponent,
  usePageViews,
} from "nextjs-google-analytics";

export default function GoogleAnalytics(): React.JSX.Element {
  usePageViews({ gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID });

  return <GoogleAnalyticsComponent trackPageViews={true} />;
}
