"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = {
  error: Error | null;
};

/**
 * Last-resort error boundary for the admin tree. Catches anything that
 * bubbles past view-level handlers and surfaces a clear "iets is mis"
 * card with a retry button. Errors are logged to the console; in stap 5
 * we can pipe them to an error tracker.
 */
export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("[admin] error boundary caught:", error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="em-error-boundary" role="alert">
        <h2>Er ging iets mis in de admin.</h2>
        <p>
          {this.state.error.message ||
            "Een onverwachte fout heeft de pagina onderbroken."}
        </p>
        <button
          type="button"
          className="em-btn em-btn-primary"
          onClick={this.reset}
        >
          Probeer opnieuw
        </button>
      </div>
    );
  }
}
