import React from "react";

// displays error message and stack trace when an unhandled error occurs
export default function errorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}
