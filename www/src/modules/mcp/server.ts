/* dotUI's MCP server: the brand interview, run by the agent, picked by the
   user in MCP App cards. Stateless — one server per request; the design
   travels in tool arguments until the pick is minted as a snapshot. */

import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { z } from "zod"

import { getSnapshotStore } from "@/lib/snapshots/store"

import { cardHtml } from "./cards"
import {
  identityCatalog,
  mintDesignSystem,
  resolveDirections,
} from "./directions"

const DIRECTIONS_URI = "ui://dotui/directions.html"

const INSTRUCTIONS = `dotUI builds a complete design system (color, type, icons, shape, density, surfaces, motion and per-component styles) on accessible React Aria components, and installs it as code the user owns with the shadcn CLI.

You run a short brand interview; the user makes the taste calls by looking at live previews.
1. Ask what they're building and for whom, and which products feel close. Skip what the conversation already answers.
2. get_design_axes once: the presets and the identity axes you compose from.
3. propose_directions: three distinct, complete directions for their brand, each a preset plus a few axes. Make them genuinely different (style, shape, color strategy, type), each a coherent point of view. The user sees them rendered live with real dotUI components and picks one in the card; their pick arrives as their next message. Don't describe the directions again in text.
4. Adjust the picked direction if they ask (call propose_directions again with variations), then create_design_system with that direction's preset and axes.
5. If you can run commands, set the project up with the install command it returns; otherwise share the studio link and the command.`

const direction = z.object({
  name: z
    .string()
    .min(1)
    .max(40)
    .describe("Two or three words, e.g. Warm studio"),
  summary: z.string().min(1).max(120).describe("One line on the point of view"),
  preset: z.string().optional().describe("A preset id from get_design_axes"),
  axes: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Axis values over the preset, keyed as in get_design_axes"),
})

const json = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value) }],
})

const failure = (problems: string[]) => ({
  content: [
    {
      type: "text" as const,
      text: `Invalid design:\n- ${problems.join("\n- ")}`,
    },
  ],
  isError: true,
})

function createServer(origin: string) {
  const server = new McpServer(
    { name: "dotui", title: "dotUI", version: "0.1.0" },
    { instructions: INSTRUCTIONS },
  )

  server.registerTool(
    "get_design_axes",
    {
      title: "Get design axes",
      description:
        "The built-in presets and the identity axes (style, color, type, icons, shape, space, surfaces, motion) with their accepted values and defaults.",
      annotations: { readOnlyHint: true },
    },
    () => json(identityCatalog()),
  )

  registerAppTool(
    server,
    "propose_directions",
    {
      title: "Propose directions",
      description:
        "Shows the user two or three complete design-system directions as live previews built from real dotUI components. The user picks one in the card.",
      inputSchema: {
        product: z.string().min(1).max(40).describe("The product's name"),
        directions: z.array(direction).min(2).max(3),
      },
      annotations: { readOnlyHint: true },
      _meta: { ui: { resourceUri: DIRECTIONS_URI } },
    },
    ({ product, directions }) => {
      const result = resolveDirections(directions)
      if (!result.ok) return failure(result.problems)
      const list = result.value
        .map((d) => `- ${d.name}: ${d.summary}`)
        .join("\n")
      return {
        content: [
          {
            type: "text" as const,
            text: `Showing ${result.value.length} live directions for ${product}:\n${list}\nThe user picks one in the card; wait for their message.`,
          },
        ],
        structuredContent: { product, directions: result.value },
      }
    },
  )

  server.registerTool(
    "create_design_system",
    {
      title: "Create design system",
      description:
        "Saves a design system (a preset plus axes) and returns its id, the studio link to refine it, and the shadcn command that installs it.",
      inputSchema: {
        name: z.string().min(1).max(64),
        preset: z.string().optional(),
        axes: z.record(z.string(), z.unknown()).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (input) => {
      const result = await mintDesignSystem(input, getSnapshotStore(), origin)
      return result.ok ? json(result.value) : failure(result.problems)
    },
  )

  registerAppResource(
    server,
    "Directions",
    DIRECTIONS_URI,
    { description: "Live design-system directions to pick from" },
    () => ({
      contents: [
        {
          uri: DIRECTIONS_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: cardHtml("directions", origin),
          _meta: {
            ui: {
              csp: {
                resourceDomains: [
                  origin,
                  "https://fonts.googleapis.com",
                  "https://fonts.gstatic.com",
                ],
              },
              prefersBorder: false,
            },
          },
        },
      ],
    }),
  )

  return server
}

/** Where the caller reached us. Behind a tunnel the request arrives as plain
 *  http on localhost, and http card URLs are blocked in a host's https
 *  frame. The headers only shape this caller's own response. */
function publicOrigin(request: Request): string {
  const url = new URL(request.url)
  const forwarded = (name: string) =>
    request.headers.get(`x-forwarded-${name}`)?.split(",")[0]?.trim()
  const proto = forwarded("proto") ?? url.protocol.slice(0, -1)
  return `${proto}://${forwarded("host") ?? url.host}`
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  const server = createServer(publicOrigin(request))
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
