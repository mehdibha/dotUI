import { getEnvironmentConfig } from "./config";
import { buildRegistry } from "./index";
import type { Style } from "../types";
import type { RegistryConfig } from "./config";
import type { RegistryContext, RegistryItem, RegistryType } from "./types";

export class RegistryService {
  private config: RegistryConfig;

  constructor(config?: Partial<RegistryConfig>) {
    this.config = getEnvironmentConfig(
      (process.env.NODE_ENV as "development" | "production" | "test") ||
        "production",
    );

    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  async generateRegistry(
    style: Style,
    styleName: string,
    type: RegistryType,
  ): Promise<RegistryItem> {
    const context: RegistryContext = {
      style,
      styleName,
      baseUrl: `${this.config.baseUrl}/${styleName}`,
    };

    return buildRegistry(context, type, {
      uiPackagePath: this.config.uiPackagePath,
    });
  }

  async generateBaseRegistry(
    style: Style,
    styleName: string,
  ): Promise<RegistryItem> {
    return this.generateRegistry(style, styleName, "base");
  }

  async generateThemeRegistry(
    style: Style,
    styleName: string,
  ): Promise<RegistryItem> {
    return this.generateRegistry(style, styleName, "theme");
  }

  async generateComponentRegistry(
    style: Style,
    styleName: string,
    componentName: keyof Style["variants"],
  ): Promise<RegistryItem> {
    return this.generateRegistry(style, styleName, componentName);
  }

  // Utility method to generate multiple registry items at once
  async generateMultipleRegistries(
    style: Style,
    styleName: string,
    types: RegistryType[],
  ): Promise<Record<string, RegistryItem>> {
    const results: Record<string, RegistryItem> = {};

    await Promise.all(
      types.map(async (type) => {
        try {
          results[type] = await this.generateRegistry(style, styleName, type);
        } catch (error) {
          console.error(`Failed to generate registry for ${type}:`, error);
          throw error;
        }
      }),
    );

    return results;
  }

  // Generate all component registries for a style
  async generateAllComponentRegistries(
    style: Style,
    styleName: string,
  ): Promise<Record<string, RegistryItem>> {
    const componentNames = Object.keys(
      style.variants,
    ) as (keyof Style["variants"])[];

    return this.generateMultipleRegistries(style, styleName, componentNames);
  }

  // Generate complete registry set (base, theme, and all components)
  async generateCompleteRegistry(
    style: Style,
    styleName: string,
  ): Promise<{
    base: RegistryItem;
    theme: RegistryItem;
    components: Record<string, RegistryItem>;
  }> {
    const [base, theme, components] = await Promise.all([
      this.generateBaseRegistry(style, styleName),
      this.generateThemeRegistry(style, styleName),
      this.generateAllComponentRegistries(style, styleName),
    ]);

    return {
      base,
      theme,
      components,
    };
  }

  // Configuration methods
  updateConfig(newConfig: Partial<RegistryConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): RegistryConfig {
    return { ...this.config };
  }
}

// Export a default instance
export const registryService = new RegistryService();
