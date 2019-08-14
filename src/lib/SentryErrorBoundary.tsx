import React from "react";
import Sentry from "sentry-expo";
import Constants from "expo-constants";

// Sentry.enableInExpoDevelopment = true;
Sentry.config(Constants.manifest.extra.SENTRY_PUBLIC_DSN).install();

export class SentryErrorBoundary extends React.Component {
  componentDidCatch(e: Error) {
    // TODO: Error report for users
    Sentry.captureException(e);
  }

  render() {
    return this.props.children;
  }
}
