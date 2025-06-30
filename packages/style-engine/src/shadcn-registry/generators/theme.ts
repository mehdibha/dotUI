import type { RegistryContext, RegistryItem } from "../types";

export function generateThemeRegistry(context: RegistryContext): RegistryItem {
  const { styleName } = context;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: `${styleName} Theme`,
    description: `Color theme for ${styleName} style`,
    files: [
      {
        path: `registry/${styleName}/theme/colors.css`,
        type: "registry:file",
        target: "app/globals.css",
      },
    ],
    cssVars: {},
    css: {},
  };
}

// function generateCssVars(context: RegistryContext) {
//   // TODO: Generate color variables based on style configuration from database
//   // For now, using default values
//   return {
//     light: {
//       background: "0 0% 100%",
//       foreground: "240 10% 3.9%",
//       card: "0 0% 100%",
//       "card-foreground": "240 10% 3.9%",
//       popover: "0 0% 100%",
//       "popover-foreground": "240 10% 3.9%",
//       primary: "240 9% 10%",
//       "primary-foreground": "0 0% 98%",
//       secondary: "240 4.8% 95.9%",
//       "secondary-foreground": "240 5.9% 10%",
//       muted: "240 4.8% 95.9%",
//       "muted-foreground": "240 3.8% 46.1%",
//       accent: "240 4.8% 95.9%",
//       "accent-foreground": "240 5.9% 10%",
//       destructive: "0 84.2% 60.2%",
//       "destructive-foreground": "0 0% 98%",
//       border: "240 5.9% 90%",
//       input: "240 5.9% 90%",
//       ring: "240 10% 3.9%",
//       radius: "0.5rem",
//     },
//     dark: {
//       background: "240 10% 3.9%",
//       foreground: "0 0% 98%",
//       card: "240 10% 3.9%",
//       "card-foreground": "0 0% 98%",
//       popover: "240 10% 3.9%",
//       "popover-foreground": "0 0% 98%",
//       primary: "0 0% 98%",
//       "primary-foreground": "240 5.9% 10%",
//       secondary: "240 3.7% 15.9%",
//       "secondary-foreground": "0 0% 98%",
//       muted: "240 3.7% 15.9%",
//       "muted-foreground": "240 5% 64.9%",
//       accent: "240 3.7% 15.9%",
//       "accent-foreground": "0 0% 98%",
//       destructive: "0 62.8% 30.6%",
//       "destructive-foreground": "0 0% 98%",
//       border: "240 3.7% 15.9%",
//       input: "240 3.7% 15.9%",
//       ring: "240 4.9% 83.9%",
//     },
//   };
// }

// function generateCssRules(context: RegistryContext) {
//   return {
//     "@layer base": {
//       ":root": {
//         "--background": "0 0% 100%",
//         "--foreground": "240 10% 3.9%",
//         "--card": "0 0% 100%",
//         "--card-foreground": "240 10% 3.9%",
//         "--popover": "0 0% 100%",
//         "--popover-foreground": "240 10% 3.9%",
//         "--primary": "240 9% 10%",
//         "--primary-foreground": "0 0% 98%",
//         "--secondary": "240 4.8% 95.9%",
//         "--secondary-foreground": "240 5.9% 10%",
//         "--muted": "240 4.8% 95.9%",
//         "--muted-foreground": "240 3.8% 46.1%",
//         "--accent": "240 4.8% 95.9%",
//         "--accent-foreground": "240 5.9% 10%",
//         "--destructive": "0 84.2% 60.2%",
//         "--destructive-foreground": "0 0% 98%",
//         "--border": "240 5.9% 90%",
//         "--input": "240 5.9% 90%",
//         "--ring": "240 10% 3.9%",
//         "--radius": "0.5rem",
//       },
//       ".dark": {
//         "--background": "240 10% 3.9%",
//         "--foreground": "0 0% 98%",
//         "--card": "240 10% 3.9%",
//         "--card-foreground": "0 0% 98%",
//         "--popover": "240 10% 3.9%",
//         "--popover-foreground": "0 0% 98%",
//         "--primary": "0 0% 98%",
//         "--primary-foreground": "240 5.9% 10%",
//         "--secondary": "240 3.7% 15.9%",
//         "--secondary-foreground": "0 0% 98%",
//         "--muted": "240 3.7% 15.9%",
//         "--muted-foreground": "240 5% 64.9%",
//         "--accent": "240 3.7% 15.9%",
//         "--accent-foreground": "0 0% 98%",
//         "--destructive": "0 62.8% 30.6%",
//         "--destructive-foreground": "0 0% 98%",
//         "--border": "240 3.7% 15.9%",
//         "--input": "240 3.7% 15.9%",
//         "--ring": "240 4.9% 83.9%",
//       },
//     },
//   };
// }
