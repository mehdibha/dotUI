import type { ExportUrl } from "./types"

/** What the AI builds once the design system is installed — the line users
 *  edit, so it closes the prompt. */
const TASK =
  "a starter dashboard: sidebar navigation, a header with a search field, a row of stat cards, a table, and a settings dialog with a switch and a select."

const INTRO =
  "dotUI is a shadcn-compatible registry: React components built on React Aria Components, styled with Tailwind CSS v4 and tailwind-variants."

const RULES = `- Build only with these components and the theme tokens (bg-bg, bg-primary, text-fg, text-fg-muted, border-border…). Don't use Radix or other shadcn styles, don't restyle the components, don't hardcode colors.
- The components compose the React Aria way, not the Radix way: check each file's exports before using it. A dialog, for example, is <Dialog><Button>Open</Button><Modal><DialogContent>…</DialogContent></Modal></Dialog>.`

/** For agents with a shell (Bolt, Lovable, Replit, Figma Make, AI Studio) and
 *  chats that can hand the commands back (ChatGPT). */
export function buildPrompt(url: ExportUrl) {
  return `Set up this project with my dotUI design system, then build the app below.

${INTRO}

1. Start from a React + TypeScript + Tailwind CSS v4 project (Vite or Next.js). Keep the existing one if there is one.
2. Install the theme (use pnpm dlx if npx is missing):
   npx shadcn@latest init ${url("init")} --force --yes --no-reinstall
   This writes the theme tokens and fonts into the global CSS and adds the @dotui registry to components.json.
3. Add every component you use from that registry, replacing any existing file of the same name:
   npx shadcn@latest add @dotui/button @dotui/card @dotui/input --overwrite --yes

${RULES}

If you can't run shell commands, download ${url("v0")} with curl: a registry item whose files[] holds the global CSS (app/globals.css) and every component (components/ui/*.tsx). Write those files verbatim. In a chat with no files, reply with the commands to run and the code to write instead.

Build: ${TASK}`
}

/** Components Claude may fetch. Its web fetch only opens URLs that appear in
 *  the conversation, so each one is spelled out. */
const FETCHABLE = [
  "button",
  "card",
  "input",
  "text-field",
  "search-field",
  "field",
  "select",
  "list-box",
  "combobox",
  "checkbox",
  "radio-group",
  "switch",
  "slider",
  "tabs",
  "dialog",
  "modal",
  "popover",
  "menu",
  "tooltip",
  "badge",
  "avatar",
  "separator",
  "table",
  "sidebar",
]

/** For claude.ai: its sandbox can't reach the registry, so Claude fetches
 *  each item with web fetch and writes the files itself. */
export function buildFetchPrompt(url: ExportUrl) {
  return `Set up my dotUI design system, then build the app below with it.

${INTRO} This design system is custom and only exists at the URLs below — don't take files from GitHub, npm or anywhere else.

Your sandbox may not reach that host, so use your web fetch tool. Every URL is a shadcn registry item (JSON): write each files[].content verbatim to its files[].path (adjusted to the project's src/ layout), install its dependencies, and fetch every URL in its registryDependencies the same way.

1. Theme: ${url("init")} — put its cssVars (theme/light/dark) and css rules into the global CSS after @import "tailwindcss", and fetch its registryDependencies (fonts).
2. Components — fetch the ones you use:
${FETCHABLE.map((name) => url(name)).join("\n")}

${RULES}

Build: ${TASK}`
}
