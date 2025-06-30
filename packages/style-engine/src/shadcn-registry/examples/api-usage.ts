// Example of how to use the registry system in an API
import { registryService } from "../registry-service";
import type { Style } from "../../types";

// Example API handler for GET /r/{styleName}/{component}
export async function handleRegistryRequest(
  styleName: string,
  component: string,
  styleFromDatabase: Style,
) {
  try {
    let registryItem;

    if (component === "base") {
      registryItem = await registryService.generateBaseRegistry(
        styleFromDatabase,
        styleName,
      );
    } else if (component === "theme") {
      registryItem = await registryService.generateThemeRegistry(
        styleFromDatabase,
        styleName,
      );
    } else {
      // Check if the component exists in the style variants
      if (!(component in styleFromDatabase.variants)) {
        throw new Error(`Component ${component} not found in style variants`);
      }

      registryItem = await registryService.generateComponentRegistry(
        styleFromDatabase,
        styleName,
        component as keyof Style["variants"],
      );
    }

    return {
      status: 200,
      data: registryItem,
    };
  } catch (error) {
    console.error(
      `Error generating registry for ${styleName}/${component}:`,
      error,
    );

    return {
      status: 404,
      error: "Component not found",
    };
  }
}

// Example: Generate complete registry for a style
export async function generateCompleteStyleRegistry(
  styleName: string,
  styleFromDatabase: Style,
) {
  try {
    const completeRegistry = await registryService.generateCompleteRegistry(
      styleFromDatabase,
      styleName,
    );

    return {
      status: 200,
      data: completeRegistry,
    };
  } catch (error) {
    console.error(
      `Error generating complete registry for ${styleName}:`,
      error,
    );

    return {
      status: 500,
      error: "Failed to generate registry",
    };
  }
}
