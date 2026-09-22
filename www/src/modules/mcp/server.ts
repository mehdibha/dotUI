/* dotUI's MCP server: the studio for agents. Stateless — one server per
   request, the design system travels as the `preset` string. */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { z } from "zod"

import { siteConfig } from "@/config/site"

import {
  exportDesign,
  getDesign,
  listAxes,
  listFonts,
  listPresets,
  previewUrls,
  setAxes,
  ToolError,
} from "./tools"

const INSTRUCTIONS = `dotUI builds a complete design system — color, type, icons, shape, space, surfaces, states, motion and per-component styles — on accessible React Aria components, and exports it as code the user owns (shadcn CLI) or into v0.

The design system is a \`preset\` string. No tool keeps state: pass the latest \`preset\` into every call and keep the one it returns. An empty preset is the default system.

Workflow:
1. list_axes with no arguments for the map of chapters, then list_axes({ chapters }) for the axes you need — each explains what it controls, its options, which real systems use them, and how systems split.
2. Optionally start from list_presets.
3. set_axes to change several axes at once; it validates every value and reports what moved in the resolved system. Chapters may offer recipes — curated combinations to pass straight to set_axes.
4. preview_urls to look at the result in a browser; iterate.
5. export for the shadcn command and the v0 link. Share the studio link so the user can keep refining by hand.

Decide like a designer: set the foundations (color, type, shape, space, surfaces) before component chapters, and keep a coherent point of view — every axis has a sensible default, so change what the brief calls for.`

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
})

function run(fn: () => unknown) {
  try {
    return text(fn())
  } catch (error) {
    if (!(error instanceof ToolError)) throw error
    return { ...text({ error: error.message }), isError: true }
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
        "The design-system axes by chapter. No arguments: every chapter with its axis keys. With `chapters`: each axis in full — description, value type, options with descriptions and the systems that use them, guidance, default — plus the chapter's recipes.",
      inputSchema: {
        chapters: z
          .array(z.string())
          .optional()
          .describe("Chapter ids from the overview, e.g. ['color', 'shape']."),
      },
      annotations: { readOnlyHint: true },
    },
    ({ chapters }) => run(() => listAxes(chapters)),
  )

  server.registerTool(
    "get_design",
    {
      title: "Get design",
      description:
        "Decode a preset: the axes it changes from the defaults (by chapter), its code options, and studio/preview links.",
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
        "Change axes and return the new preset. Atomic: any unknown key or invalid value fails the whole call with every problem listed. Returns the tokens and component params that moved, so you can confirm the change did what you meant.",
      inputSchema: {
        preset,
        set: z
          .record(z.string(), z.unknown())
          .optional()
          .describe("Axis key → value, e.g. { buttonStyle: 'raised' }."),
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
    (input) => run(() => setAxes(origin, input)),
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
        "Families the font axes accept (Google Fonts), filterable by category or name.",
      inputSchema: {
        category: z
          .enum(["sans-serif", "serif", "display", "handwriting", "mono"])
          .optional(),
        query: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    ({ category, query }) => run(() => listFonts(category, query)),
  )

  server.registerTool(
    "preview_urls",
    {
      title: "Preview URLs",
      description:
        "Browser URLs that render the design system: the studio, an overview style guide, and real app screens (dashboard, settings, mail…).",
      inputSchema: { preset },
      annotations: { readOnlyHint: true },
    },
    ({ preset }) => run(() => previewUrls(origin, preset)),
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
