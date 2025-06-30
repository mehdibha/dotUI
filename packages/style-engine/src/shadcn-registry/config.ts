export interface RegistryConfig {
  uiPackagePath: string;
  baseUrl: string;
  schemaUrl: string;
}

export const defaultRegistryConfig: RegistryConfig = {
  uiPackagePath: "../ui",
  baseUrl: "https://dotui.org/r",
  schemaUrl: "https://ui.shadcn.com/schema/registry-item.json",
};

export function createRegistryConfig(
  overrides: Partial<RegistryConfig> = {},
): RegistryConfig {
  return {
    ...defaultRegistryConfig,
    ...overrides,
  };
}

// Environment-specific configurations
export const developmentConfig: Partial<RegistryConfig> = {
  // Development-specific settings can be added here
};

export const productionConfig: Partial<RegistryConfig> = {
  // Production-specific settings can be added here
};

export function getEnvironmentConfig(
  env: "development" | "production" | "test" = "production",
): RegistryConfig {
  switch (env) {
    case "development":
      return createRegistryConfig(developmentConfig);
    case "test":
      return createRegistryConfig({});
    case "production":
    default:
      return createRegistryConfig(productionConfig);
  }
}
