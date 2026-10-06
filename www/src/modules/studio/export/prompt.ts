import type { ExportUrl } from "./types"

/** Installs the design system with the shadcn CLI, then builds a starter app.
 *  The task closes the prompt: it's the line users edit. */
export function buildPrompt(url: ExportUrl) {
  return `Set up this project with my dotUI design system, then build the app below.

dotUI is a shadcn-compatible registry: React components built on React Aria Components, styled with Tailwind CSS v4 and tailwind-variants.

1. Start from a React + TypeScript + Tailwind CSS v4 project (Vite or Next.js). Keep the existing one if there is one.
2. Install the theme (use pnpm dlx if npx is missing):
   npx shadcn@latest init ${url("init")} --force --yes --no-reinstall
   This writes the theme tokens and fonts into the global CSS and adds the @dotui registry to components.json.
3. Add every component, replacing any existing file of the same name:
   npx shadcn@latest add @dotui/all --overwrite --yes

- Build only with these components and the theme tokens (bg-bg, bg-primary, text-fg, text-fg-muted, border-border…). Don't use Radix or other shadcn styles, don't restyle the components, don't hardcode colors.
- The components compose the React Aria way, not the Radix way: check each file's exports before using it. A dialog, for example, is <Dialog><Button>Open</Button><Modal><DialogContent>…</DialogContent></Modal></Dialog>.

If you can't run shell commands, download ${url("v0")} with curl: a registry item whose files[] holds the global CSS (app/globals.css) and every component (components/ui/*.tsx). Write those files verbatim. In a chat with no files, reply with the commands to run and the code to write instead.

Build: a starter dashboard: sidebar navigation, a header with a search field, a row of stat cards, a table, and a settings dialog with a switch and a select.`
}
