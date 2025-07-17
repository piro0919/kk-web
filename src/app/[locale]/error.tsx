"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import ErrorComponent from "./_components/Error";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return <ErrorComponent />;
}
