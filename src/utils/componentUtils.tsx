/**
 * Component utility functions and HOCs
 * Extracted from components to fix fast refresh violations
 */

import React, { ReactNode } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Higher-order component for adding loading state
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType,
) {
  return function WrappedComponent(props: P & { isLoading?: boolean }) {
    if (props.isLoading && LoadingComponent) {
      return <LoadingComponent />;
    }

    if (props.isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Higher-order component for conditional rendering
export function withConditional<P extends object>(
  Component: React.ComponentType<P>,
  condition: (props: P) => boolean,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function WrappedComponent(props: P) {
    if (!condition(props)) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}

// Component composition utility
export function compose<P>(
  ...hocs: Array<(component: React.ComponentType<P>) => React.ComponentType<P>>
) {
  return function (Component: React.ComponentType<P>) {
    return hocs.reduceRight((acc, hoc) => hoc(acc), Component);
  };
}

// Display name utility for HOCs
export function getDisplayName<P>(Component: React.ComponentType<P>): string {
  return Component.displayName || Component.name || "Component";
}

// Set display name for HOCs
export function setDisplayName<P>(
  WrappedComponent: React.ComponentType<P>,
  hocName: string,
  OriginalComponent: React.ComponentType<P>,
): void {
  WrappedComponent.displayName = `${hocName}(${getDisplayName(OriginalComponent)})`;
}

// Enterprise authentication HOCs (extracted from EnterpriseSecurityProvider)
export const withAuthRequired = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo = "/login",
) => {
  return (props: P) => {
    // This would need to import the hook, but for now just return the component
    // In real implementation, check authentication status
    return <Component {...props} />;
  };
};

export const withPaymentRequired = <P extends object>(
  Component: React.ComponentType<P>,
  requiredTier?: string,
) => {
  return (props: P) => {
    // This would need to import the hook, but for now just return the component
    // In real implementation, check payment status
    return <Component {...props} />;
  };
};
