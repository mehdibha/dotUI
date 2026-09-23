/* dotUI's MCP server: the studio for agents. Stateless — one server per
   request, the design system travels as the `preset` string. */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { z } from "zod"

import { siteConfig } from "@/config/site"

import { OVERVIEW_SECTIONS, render, RENDER_MODES } from "./render"
import {
  check,
  exportDesign,
  getDesign,
  listAxes,
  listFonts,
  listPresets,
  PREVIEW_PAGES,
  previewUrls,
  setAxes,
  ToolError,
} from "./tools"

const INSTRUCTIONS = `dotUI builds a complete design system — color, type, icons, shape, space, surfaces, states, motion and per-component styles — on accessible React Aria components, and exports it as code the user owns (shadcn CLI) or into v0.

The design system is a \`preset\` string. No tool keeps state: pass the latest \`preset\` into every call and keep the one it returns. An empty preset is the default system.

Workflow:
1. If the brief names a real product or design system, research its tokens first (brand hex, fonts, radius, density) — don't guess its look.
2. list_axes with no arguments: every chapter with its axis keys, labels, value vocabularies, defaults and cautions — a caution is a trap the value springs; read it before picking that value. Then list_axes({ chapters }) for one-line descriptions, and list_axes({ axes }) for the full guidance and real-system evidence of the axes you are deciding. Font axes take a family from list_fonts. Optionally start from list_presets.
3. set_axes, several axes per call. Change only what the brief calls for: every axis has a sensible default, and set_axes lists values you restated as \`noop\`. For a brand-forward system set \`primaryColor: "accent"\` — it moves buttons, checks, switch, slider, tabs, links and focus together.
4. check after color, type, shape or space changes: resolved colors per mode, WCAG contrast, neutral tint, brand fidelity, sizes. Fix what \`problems\` lists where an axis reaches it; \`inDefaults\` are failures the default system shares.
5. render to look at the result: screenshots of the overview and of real app screens, light and dark. Look at them after check, and iterate on what you see — check reads numbers, render shows whether the system reads as intended. preview_urls gives the same pages for a browser. Only if render failed or is unavailable, tell the user the design is unseen and that check was your only verification.
6. export for the shadcn command and the v0 link. Share the studio link so the user can keep refining by hand.

Set the foundations (color, type, shape, space, surfaces) before component chapters, and keep one coherent point of view.

Reporting to the user: describe only what \`nonDefault\` lists; \`noop\` keys were already at that value, so restating a default is not a decision. Before stating a color, size or contrast, quote the value check returned, not what you asked for.`

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value) }],
})

function failed(error: unknown) {
  if (!(error instanceof ToolError)) throw error
  return { ...text({ error: error.message }), isError: true }
}

function run(fn: () => unknown) {
  try {
    return text(fn())
  } catch (error) {
    return failed(error)
  }
}

const preset = z
  .string()
  .optional()
  .describe("The current design system; omit for the defaults.")

function createServer(origin: string, registryOrigin: string) {
  const server = new McpServer(
    { name: "dotui", version: "1.0.0" },
    { instructions: INSTRUCTIONS },
  )

  server.registerTool(
    "list_axes",
    {
      title: "List axes",
      description:
        "The design-system axes by chapter. No arguments: every chapter with each axis key, label, values (enum values or number range), default and cautions (traps of the axis or of a value, by value); primaryColor is a write-only shortcut. `chapters`: those chapters with each axis's label and one-line description (detail 'full' adds option descriptions, guidance and the real systems that use each option) plus the chapter's recipes. `axes`: specific axes in full.",
      inputSchema: {
        chapters: z
          .array(z.string())
          .optional()
          .describe("Chapter ids from the overview, e.g. ['color', 'shape']."),
        axes: z
          .array(z.string())
          .optional()
          .describe(
            "Axis keys to read in full, e.g. ['buttonStyle', 'neutralTint'].",
          ),
        detail: z
          .enum(["brief", "full"])
          .optional()
          .describe("For `chapters`: 'brief' (default) or 'full'."),
      },
      annotations: { readOnlyHint: true },
    },
    (input) => run(() => listAxes(input)),
  )

  server.registerTool(
    "get_design",
    {
      title: "Get design",
      description:
        "Decode a preset: the axes it changes from the defaults (by chapter), its Primary source (neutral, accent or mixed), its code options, and studio/preview links.",
      inputSchema: { preset },
      annotations: { readOnlyHint: true },
    },
    ({ preset }) => run(() => getDesign(origin, preset)),
  )

  server.registerTool(
    "set_axes",
    {
      title: "Set axes",
      description:
        "Change axes and return the new preset. Atomic: any unknown key or invalid value fails the whole call with every problem listed. Returns `applied` (this call's changes, from → to), `noop` (keys already at that value), `warnings` (cautions of the values applied, incoherent combinations, contrast problems when colors moved), `effects` (the tokens and component params that moved) and `nonDefault` (every axis off its default, by chapter).",
      inputSchema: {
        preset,
        set: z
          .record(z.string(), z.unknown())
          .optional()
          .describe(
            "Axis key → value, e.g. { buttonStyle: 'raised' }. `primaryColor: 'neutral' | 'accent'` sets every Primary leaf at once.",
          ),
        reset: z
          .array(z.string())
          .optional()
          .describe("Axis keys or chapter ids to return to default; 'all'."),
        codeOptions: z
          .object({
            classArrays: z.boolean().optional(),
            sectionComments: z.boolean().optional(),
          })
          .optional()
          .describe(
            "Style of the exported code: classArrays = one class group per line instead of one string per slot; sectionComments = comment separators between file sections.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    (input) => run(() => setAxes(input)),
  )

  server.registerTool(
    "check",
    {
      title: "Check",
      description:
        "Verify the design system without a browser, from the real engine. Per mode (light, dark): the resolved hex of the --color-* tokens the components read (bg, card, popover, field, border, border-control, fg, fg-muted, primary, accent, danger, statuses; `neutral` is the fill of muted areas, fields, soft badges and avatars), WCAG 2 contrast for the pairs that matter with pass/fail (4.5 text, 3 non-text), neutral chroma (under 0.005 reads as pure gray; `neutralTinted` per mode) and the brand seed's ΔEok to the rendered accent. Also brand vs status hues, control height and text size, radii in px, `problems` in plain words — failures this design introduced or worsened — and `inDefaults`, failures the default system has too (still real failures; tell the user). `tradeoffs` lists known costs of a look you chose (subtle control borders miss 3:1) — mention them, don't fix them unless the brief asks. `notes` flags a mixed Primary.",
      inputSchema: { preset },
      annotations: { readOnlyHint: true },
    },
    ({ preset }) => run(() => check(preset)),
  )

  server.registerTool(
    "list_presets",
    {
      title: "List presets",
      description: "Built-in design systems to start from, each as a preset.",
      annotations: { readOnlyHint: true },
    },
    () => run(listPresets),
  )

  server.registerTool(
    "list_fonts",
    {
      title: "List fonts",
      description:
        "Families the font axes accept — a curated set of Google variable fonts, most-used first — filterable by category or name. `more` counts matches past the limit; `otherCategories` lists name matches the category filter hid.",
      inputSchema: {
        category: z
          .enum(["sans-serif", "serif", "display", "handwriting", "mono"])
          .optional(),
        query: z.string().optional().describe("Part of a family name."),
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Most families to return; default 30."),
      },
      annotations: { readOnlyHint: true },
    },
    (input) => run(() => listFonts(input)),
  )

  server.registerTool(
    "preview_urls",
    {
      title: "Preview URLs",
      description:
        "A preview URL template that renders the design system in a browser, the pages to fill it with (an overview style guide and real app screens: dashboard, settings, mail…) and the studio link.",
      inputSchema: {
        preset,
        pages: z
          .array(z.string())
          .optional()
          .describe("Only these pages, e.g. ['overview', 'dashboard']."),
      },
      annotations: { readOnlyHint: true },
    },
    ({ preset, pages }) => run(() => previewUrls(origin, preset, pages)),
  )

  server.registerTool(
    "render",
    {
      title: "Render",
      description:
        "Screenshots of a preview page in this design system — returns JPEG images (one per mode, 1280px wide, up to 2000px tall) plus a text item naming each image's mode, URL and crop. Takes a few seconds per page; repeat calls are cached. The overview is long: its first image covers the top, `section` jumps to a later part.",
      inputSchema: {
        preset,
        page: z
          .string()
          .optional()
          .describe(
            `'overview' (default: the style guide) or an app screen: ${PREVIEW_PAGES.slice(1).join(", ")}.`,
          ),
        mode: z
          .enum(RENDER_MODES)
          .optional()
          .describe("'light', 'dark' or 'both' (default)."),
        section: z
          .string()
          .optional()
          .describe(
            `Overview only: capture from this section down — ${Object.keys(OVERVIEW_SECTIONS).join(", ")}.`,
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async (input) => {
      const { screenshot } = await import("./chrome")
      try {
        return { content: await render(origin, input, screenshot) }
      } catch (error) {
        return failed(error)
      }
    },
  )

  server.registerTool(
    "export",
    {
      title: "Export",
      description:
        "How to ship the design system: the shadcn init command per package manager (new or existing project), the Open-in-v0 link, and the studio link.",
      inputSchema: { preset },
      annotations: { readOnlyHint: true },
    },
    ({ preset }) => run(() => exportDesign(registryOrigin, preset)),
  )

  return server
}

/** v0 and the shadcn CLI fetch registry URLs server-side: never localhost. */
function registryOriginFor(origin: string) {
  const { hostname } = new URL(origin)
  return hostname === "localhost" || hostname === "127.0.0.1"
    ? siteConfig.url
    : origin
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  const origin = new URL(request.url).origin
  const server = createServer(origin, registryOriginFor(origin))
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
