import type { RegistryItem } from "@/registry/types";
import { ui } from "@/registry/registry-ui";
import { hasStyles } from "@/registry/types";
import { db } from "@repo/db/client";
import { styles } from "@repo/db/schema";
import { and, eq } from "drizzle-orm";

import { componentCache } from "./cache";

// Official styles that are built-in
const OFFICIAL_STYLES = [
  "minimalist",
  "material",
  "ghibli",
  "primer",
  "supabase",
  "brutalist",
  "polaris",
  "retro",
] as const;

export interface ComponentResolutionResult {
  success: boolean;
  component?: RegistryItem;
  error?: string;
}

/**
 * Resolve a component for a specific style with caching
 * Handles both official styles and custom user styles
 */
export async function resolveComponent(
  userName: string,
  styleName: string,
  componentName: string,
): Promise<ComponentResolutionResult> {
  // Check cache first
  const cached = componentCache.get(userName, styleName, componentName);
  if (cached !== null) {
    return cached;
  }

  try {
    let result: ComponentResolutionResult;

    // Handle official dotui styles
    if (userName === "dotui" && OFFICIAL_STYLES.includes(styleName as any)) {
      result = resolveOfficialComponent(styleName, componentName);
    }

    // Handle community/public styles
    else if (userName === "community") {
      result = await resolvePublicComponent(styleName, componentName);
    }

    // Handle custom user styles
    else {
      result = await resolveUserComponent(userName, styleName, componentName);
    }

    // Cache the result
    componentCache.set(userName, styleName, componentName, result);

    return result;
  } catch (error) {
    console.error("Error resolving component:", error);
    const errorResult = {
      success: false,
      error: "Failed to resolve component",
    } as const;

    // Don't cache errors
    return errorResult;
  }
}

/**
 * Resolve official dotui component
 */
function resolveOfficialComponent(
  styleName: string,
  componentName: string,
): ComponentResolutionResult {
  // Find the component in the registry
  const registryItem = ui.find((item) => item.name === componentName);

  if (!registryItem) {
    return {
      success: false,
      error: "Component not found",
    };
  }

  // If the component has styles, find the appropriate style variant
  if (hasStyles(registryItem)) {
    const styleVariant = registryItem.styles.find(
      (style) => style.name === styleName || style.name === "basic",
    );

    if (!styleVariant) {
      return {
        success: false,
        error: "Style variant not found",
      };
    }

    return {
      success: true,
      component: styleVariant,
    };
  }

  // Return the component as-is if no styles
  return {
    success: true,
    component: registryItem,
  };
}

/**
 * Resolve public community component
 */
async function resolvePublicComponent(
  styleName: string,
  componentName: string,
): Promise<ComponentResolutionResult> {
  // Find public style in database
  const style = await db
    .select()
    .from(styles)
    .where(and(eq(styles.name, styleName), eq(styles.isPublic, true)))
    .limit(1);

  if (!style.length) {
    return {
      success: false,
      error: "Public style not found",
    };
  }

  return buildComponentFromStyle(style[0]!, componentName);
}

/**
 * Resolve user-specific component
 */
async function resolveUserComponent(
  userName: string,
  styleName: string,
  componentName: string,
): Promise<ComponentResolutionResult> {
  // Find user's style in database
  const style = await db
    .select()
    .from(styles)
    .where(and(eq(styles.userName, userName), eq(styles.name, styleName)))
    .limit(1);

  if (!style.length) {
    return {
      success: false,
      error: "User style not found",
    };
  }

  return buildComponentFromStyle(style[0]!, componentName);
}

/**
 * Build component response from style configuration
 */
function buildComponentFromStyle(
  style: typeof styles.$inferSelect,
  componentName: string,
): ComponentResolutionResult {
  // Get the component mapping from style config
  const componentVariant = style.componentMappings[componentName];

  if (!componentVariant) {
    return {
      success: false,
      error: "Component not available in this style",
    };
  }

  // Find the base component in registry
  const registryItem = ui.find((item) => item.name === componentName);

  if (!registryItem) {
    return {
      success: false,
      error: "Base component not found",
    };
  }

  // If the component has styles, find the mapped variant
  if (hasStyles(registryItem)) {
    const styleVariant = registryItem.styles.find(
      (s) => s.name === componentVariant,
    );

    if (!styleVariant) {
      return {
        success: false,
        error: "Style variant not found in registry",
      };
    }

    return {
      success: true,
      component: styleVariant,
    };
  }

  // Return the component as-is if no styles
  return {
    success: true,
    component: registryItem,
  };
}
