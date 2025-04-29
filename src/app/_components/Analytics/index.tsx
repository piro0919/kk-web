"use client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

function Analytics(): React.JSX.Element {
  return <VercelAnalytics />;
}

export default Analytics;
