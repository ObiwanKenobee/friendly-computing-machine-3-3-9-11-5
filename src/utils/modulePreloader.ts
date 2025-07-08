/**
 * Module Preloader and Recovery Utility
 * Helps prevent and recover from module import failures
 */

import React from "react";

interface ModulePreloadOptions {
  retryAttempts?: number;
  retryDelay?: number;
  fallbackComponent?: React.ComponentType;
  onError?: (error: Error, moduleName: string) => void;
}

class ModulePreloader {
  private static instance: ModulePreloader;
  private preloadedModules = new Map<string, Promise<any>>();
  private failedModules = new Set<string>();
  private retryAttempts = new Map<string, number>();

  private constructor() {}

  public static getInstance(): ModulePreloader {
    if (!ModulePreloader.instance) {
      ModulePreloader.instance = new ModulePreloader();
    }
    return ModulePreloader.instance;
  }

  /**
   * Preload a module with retry logic and error handling
   */
  public async preloadModule(
    moduleName: string,
    importFn: () => Promise<any>,
    options: ModulePreloadOptions = {},
  ): Promise<any> {
    const { retryAttempts = 3, retryDelay = 1000, onError } = options;

    // Check if module is already preloaded
    if (this.preloadedModules.has(moduleName)) {
      return this.preloadedModules.get(moduleName);
    }

    // Check if module has failed too many times
    if (this.failedModules.has(moduleName)) {
      throw new Error(
        `Module ${moduleName} has failed to load and is blacklisted`,
      );
    }

    const preloadPromise = this.attemptModuleLoad(
      moduleName,
      importFn,
      retryAttempts,
      retryDelay,
      onError,
    );

    this.preloadedModules.set(moduleName, preloadPromise);
    return preloadPromise;
  }

  private async attemptModuleLoad(
    moduleName: string,
    importFn: () => Promise<any>,
    maxRetries: number,
    delay: number,
    onError?: (error: Error, moduleName: string) => void,
  ): Promise<any> {
    let currentAttempt = this.retryAttempts.get(moduleName) || 0;

    while (currentAttempt < maxRetries) {
      try {
        const module = await importFn();

        // Success - reset retry counter and return module
        this.retryAttempts.delete(moduleName);
        return module;
      } catch (error) {
        currentAttempt++;
        this.retryAttempts.set(moduleName, currentAttempt);

        console.warn(
          `Module ${moduleName} failed to load (attempt ${currentAttempt}/${maxRetries}):`,
          error,
        );

        if (onError) {
          onError(error as Error, moduleName);
        }

        // If this was the last attempt, mark as failed
        if (currentAttempt >= maxRetries) {
          this.failedModules.add(moduleName);
          this.preloadedModules.delete(moduleName);
          throw new Error(
            `Module ${moduleName} failed to load after ${maxRetries} attempts: ${(error as Error).message}`,
          );
        }

        // Wait before next attempt with exponential backoff
        await this.delay(delay * Math.pow(2, currentAttempt - 1));
      }
    }

    throw new Error(`Module ${moduleName} failed to load`);
  }

  /**
   * Clear failed modules and allow retry
   */
  public clearFailedModules(): void {
    this.failedModules.clear();
    this.retryAttempts.clear();
    console.log("Cleared failed modules - allowing retries");
  }

  /**
   * Get list of failed modules
   */
  public getFailedModules(): string[] {
    return Array.from(this.failedModules);
  }

  /**
   * Check if a module has failed
   */
  public isModuleFailed(moduleName: string): boolean {
    return this.failedModules.has(moduleName);
  }

  /**
   * Force reload a specific module
   */
  public async forceReloadModule(
    moduleName: string,
    importFn: () => Promise<any>,
  ): Promise<any> {
    // Clear any cached version
    this.preloadedModules.delete(moduleName);
    this.failedModules.delete(moduleName);
    this.retryAttempts.delete(moduleName);

    // Attempt to reload
    return this.preloadModule(moduleName, importFn);
  }

  /**
   * Preload critical modules on app start
   */
  public async preloadCriticalModules(): Promise<void> {
    const criticalModules = [
      {
        name: "PlatformNavigation",
        importFn: () => import("../components/PlatformNavigation"),
      },
      {
        name: "ErrorBoundary",
        importFn: () => import("../components/ErrorBoundary"),
      },
      {
        name: "LoadingDiagnostics",
        importFn: () => import("../components/LoadingDiagnostics"),
      },
    ];

    const preloadPromises = criticalModules.map((module) =>
      this.preloadModule(module.name, module.importFn, {
        retryAttempts: 2,
        retryDelay: 500,
        onError: (error, moduleName) => {
          console.error(
            `Critical module ${moduleName} failed to preload:`,
            error,
          );
        },
      }).catch((error) => {
        console.error(`Failed to preload critical module:`, error);
        return null; // Don't fail the entire preload process
      }),
    );

    await Promise.allSettled(preloadPromises);
    console.log("Critical module preloading completed");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get module loading statistics
   */
  public getStats() {
    return {
      preloadedModules: this.preloadedModules.size,
      failedModules: this.failedModules.size,
      totalRetryAttempts: Array.from(this.retryAttempts.values()).reduce(
        (sum, attempts) => sum + attempts,
        0,
      ),
    };
  }
}

export default ModulePreloader;

/**
 * Enhanced lazy import with preloader support
 */
export const createResilientLazyImport = (
  moduleName: string,
  importFn: () => Promise<any>,
  options: ModulePreloadOptions = {},
) => {
  const preloader = ModulePreloader.getInstance();

  return React.lazy(async () => {
    try {
      return await preloader.preloadModule(moduleName, importFn, options);
    } catch (error) {
      console.error(`Resilient lazy import failed for ${moduleName}:`, error);

      // Return a fallback component
      if (options.fallbackComponent) {
        return { default: options.fallbackComponent };
      }

      // Default fallback
      return {
        default: () =>
          React.createElement(
            "div",
            {
              className:
                "min-h-screen bg-gray-50 flex items-center justify-center p-4",
            },
            React.createElement(
              "div",
              {
                className: "text-center",
              },
              [
                React.createElement(
                  "h2",
                  {
                    key: "title",
                    className: "text-xl font-bold text-red-600 mb-4",
                  },
                  `Failed to load ${moduleName}`,
                ),
                React.createElement(
                  "p",
                  {
                    key: "description",
                    className: "text-gray-600",
                  },
                  "This component could not be loaded. Please refresh the page or try again later.",
                ),
              ],
            ),
          ),
      };
    }
  });
};
