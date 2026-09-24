import { siteConfig } from "./site"

// Served at /home.md: by the route on node/dev, and as a static file written
// by scripts/patch-vercel-config.ts on Vercel.
export const HOME_MD = `# dotUI

> ${siteConfig.description}

dotUI is a design system studio and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript. Compose your design system in the studio (${siteConfig.url}/studio) — colors, typography, icons, density, radius and per-component styles, previewed live on real components — then own it as code through the shadcn CLI, the registry endpoint, or v0.

## Documentation

- Overview (what dotUI is, how to install): ${siteConfig.url}/docs
- Components index (llms.txt): ${siteConfig.url}/llms.txt
- Full documentation, single file (llms-full.txt): ${siteConfig.url}/llms-full.txt
- Component registry API: GET ${siteConfig.url}/r/{name}

## Links

- GitHub: ${siteConfig.links.github}
- X (Twitter): ${siteConfig.links.twitter}
- Discord: ${siteConfig.links.discord}
`
