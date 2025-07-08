/**
 * Safe Singleton Pattern Utility
 * Prevents infinite recursion and circular dependency issues
 */

export interface SafeSingleton {
  isInitialized: boolean;
  ensureInitialized(): void;
}

export abstract class SafeSingletonBase implements SafeSingleton {
  protected isInitialized: boolean = false;

  constructor() {
    // Never initialize in constructor to prevent circular dependencies
  }

  public ensureInitialized(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.initialize();
    }
  }

  protected abstract initialize(): void;
}

/**
 * Safe singleton decorator
 */
export function SafeSingletonService<T extends new (...args: any[]) => any>(
  constructor: T,
): T {
  let instance: InstanceType<T> | null = null;

  return class extends constructor {
    static getInstance(): InstanceType<T> {
      if (!instance) {
        instance = new constructor();
      }
      return instance;
    }
  } as T;
}

/**
 * Lazy initialization decorator for methods
 */
export function LazyInit(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (
      "ensureInitialized" in this &&
      typeof this.ensureInitialized === "function"
    ) {
      this.ensureInitialized();
    }
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

/**
 * Legacy singletonPattern function for backward compatibility
 */
export function singletonPattern<T>(factory: () => T): T {
  let instance: T | null = null;
  return new Proxy({} as T, {
    get: function (target, prop) {
      if (!instance) {
        instance = factory();
      }
      const value = (instance as any)[prop];
      if (typeof value === "function") {
        return value.bind(instance);
      }
      return value;
    },
  });
}

/**
 * Service registry to track all singletons
 */
class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, SafeSingleton> = new Map();
  private initializationOrder: string[] = [];

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  register(name: string, service: SafeSingleton): void {
    this.services.set(name, service);
  }

  initializeAll(): void {
    for (const [name, service] of this.services) {
      if (!service.isInitialized) {
        console.log(`Initializing service: ${name}`);
        service.ensureInitialized();
        this.initializationOrder.push(name);
      }
    }
  }

  getInitializationOrder(): string[] {
    return [...this.initializationOrder];
  }

  getServiceStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const [name, service] of this.services) {
      status[name] = service.isInitialized;
    }
    return status;
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();

/**
 * Utility functions for safe service management
 */
export const ServiceUtils = {
  /**
   * Initialize all registered services in dependency order
   */
  initializeAllServices(): void {
    serviceRegistry.initializeAll();
  },

  /**
   * Get the status of all services
   */
  getServiceStatus(): Record<string, boolean> {
    return serviceRegistry.getServiceStatus();
  },

  /**
   * Get service initialization order
   */
  getInitializationOrder(): string[] {
    return serviceRegistry.getInitializationOrder();
  },

  /**
   * Check if a service is initialized
   */
  isServiceInitialized(serviceName: string): boolean {
    const status = serviceRegistry.getServiceStatus();
    return status[serviceName] || false;
  },
};
