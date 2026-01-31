import React, { useCallback } from "react";
import { Button } from "./Button";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps): React.ReactElement {
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="au-error-display">
      <div className="au-error-display__icon">!</div>
      <h2 className="au-error-display__title">Something went wrong</h2>
      <p className="au-error-display__message">{error}</p>
      <p className="au-error-display__apology">
        We're sorry for the inconvenience. Please try refreshing the page.
      </p>
      <Button variant="primary" onClick={handleRefresh}>
        Refresh Page
      </Button>
    </div>
  );
}
