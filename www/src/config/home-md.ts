import { siteConfig } from "./site"

// Markdown view of the homepage for AI agents, served at /home.md. Single
// source for both the src/routes/home[.]md.tsx route (node preset / local dev)
// and the static file scripts/patch-vercel-config.ts emits on Vercel.
export const homeMarkdown = `# dotUI

> ${siteConfig.description}

dotUI is a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Generate a UI library that looks like your product — not a preset — with the style editor, then consume it through the shadcn CLI, the registry endpoint, or AI tooling like v0.

## Documentation

- Introduction: ${siteConfig.url}/docs
- Installation: ${siteConfig.url}/docs/installation
- Components index (llms.txt): ${siteConfig.url}/llms.txt
- Full documentation, single file (llms-full.txt): ${siteConfig.url}/llms-full.txt
- Component registry API: GET ${siteConfig.url}/r/{name}

## Links

- GitHub: ${siteConfig.links.github}
- X (Twitter): ${siteConfig.links.twitter}
- Discord: ${siteConfig.links.discord}
`
