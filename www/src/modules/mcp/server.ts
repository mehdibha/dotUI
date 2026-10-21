/* dotUI's MCP server: the brand interview, run by the agent, decided by the
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
  compareDesigns,
  identityCatalog,
  mintDesignSystem,
  pairingAxes,
  resolveDesign,
  resolveDirections,
  resolvePairings,
  resolveSwatches,
  SHAPE_VALUES,
} from "./design"
import type { DesignInput } from "./design"

const CARD_URI = "ui://dotui/card.html"

const INSTRUCTIONS = `dotUI builds a complete design system (color, type, icons, shape, density, surfaces, motion and per-component styles) on accessible React Aria components, and installs it as code the user owns with the shadcn CLI.

You run a short brand interview; the user makes the taste calls by looking at live previews in cards. Ask in words only for facts (what the product is, who it's for, how it should feel, products they like); infer whatever the conversation, an attached logo or a link already tells you.
1. get_design_axes once: the presets, the shapes and the identity axes.
2. propose_directions: three distinct, complete directions, each a preset, optionally a shape, and at most six axes. Make them genuinely different points of view.
3. After the pick: ask_color unless the brand color is already known (pass colors from their logo or site as candidates), then ask_type unless the fonts are known. Pass the picked design along.
4. Any change they ask for ("warmer", "sharper corners"): refine with the current design and the changes, and carry the proposed design forward only if they accept.
5. create_design_system with the final design: it shows the install card. If you can run commands, set the project up with it.

Every design argument is the whole design so far: { preset, shape, axes }. Picks arrive as the user's next message, and the exact axes the card chose arrive in your context: merge those axes into the design before the next call. Don't restate in text what a card shows.`

const designShape = {
  preset: z.string().optional().describe("A preset id from get_design_axes"),
  shape: z
    .enum(SHAPE_VALUES)
    .optional()
    .describe("A corner look: sets the radius and every role together"),
  axes: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Axis values on top, keyed as in get_design_axes"),
}
const design = z.object(designShape)
const product = z.string().min(1).max(40).describe("The product's name")

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

const card = (text: string, structuredContent: Record<string, unknown>) => ({
  content: [{ type: "text" as const, text }],
  structuredContent,
})

const ui = { ui: { resourceUri: CARD_URI } }

function createServer(origin: string) {
  const server = new McpServer(
    { name: "dotui", title: "dotUI", version: "0.2.0" },
    { instructions: INSTRUCTIONS },
  )

  server.registerTool(
    "get_design_axes",
    {
      title: "Get design axes",
      description:
        "The built-in presets, the corner shapes and the identity axes (style, color, type, icons, shape, space, surfaces, motion) with their accepted values and defaults.",
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
        "Shows two or three complete design-system directions as live previews built from real dotUI components. The user picks one in the card.",
      inputSchema: {
        product,
        directions: z
          .array(
            z.object({
              name: z
                .string()
                .min(1)
                .max(40)
                .describe("Two or three words, e.g. Warm studio"),
              summary: z
                .string()
                .min(1)
                .max(120)
                .describe("One line on the point of view"),
              ...designShape,
            }),
          )
          .min(2)
          .max(3),
      },
      annotations: { readOnlyHint: true },
      _meta: ui,
    },
    ({ product, directions }) => {
      const result = resolveDirections(directions)
      if (!result.ok) return failure(result.problems)
      const list = result.value
        .map((d) => `- ${d.name}: ${d.summary}`)
        .join("\n")
      return card(
        `Showing ${result.value.length} live directions for ${product}:\n${list}\nThe user picks one in the card; wait for their message.`,
        { card: "directions", product, directions: result.value },
      )
    },
  )

  registerAppTool(
    server,
    "ask_color",
    {
      title: "Ask color",
      description:
        "Shows the brand color card: candidate swatches, a color picker, brand or ink buttons and the neutral tint, previewed live in light and dark with measured contrast.",
      inputSchema: {
        product,
        design: design.describe("The design so far"),
        candidates: z
          .array(
            z.object({
              color: z.string().describe("Any CSS color"),
              label: z.string().max(30).optional(),
            }),
          )
          .max(6)
          .optional()
          .describe("Colors from their logo, site or brief"),
      },
      annotations: { readOnlyHint: true },
      _meta: ui,
    },
    ({ product, design: input, candidates = [] }) => {
      const resolved = resolveDesign(input)
      const swatches = resolveSwatches(candidates)
      const problems = [
        ...(resolved.ok ? [] : resolved.problems),
        ...(swatches.ok ? [] : swatches.problems),
      ]
      if (!resolved.ok || !swatches.ok) return failure(problems)
      return card(
        `Showing the color card for ${product}. The user picks in the card; wait for their message.`,
        {
          card: "color",
          product,
          design: resolved.value,
          candidates: swatches.value,
        },
      )
    },
  )

  registerAppTool(
    server,
    "ask_type",
    {
      title: "Ask type",
      description:
        "Shows two to four type pairings set in the product's own copy with the design's components. The user picks one in the card.",
      inputSchema: {
        product,
        design: design.describe("The design so far"),
        pairings: z
          .array(
            z.object({
              name: z.string().max(30).optional(),
              heading: z.string().describe("A Google Fonts family"),
              body: z.string().describe("A Google Fonts family"),
              mono: z.string().optional().describe("A Google Fonts family"),
            }),
          )
          .min(2)
          .max(4),
        sample: z
          .string()
          .max(140)
          .optional()
          .describe("A sentence in the product's voice"),
      },
      annotations: { readOnlyHint: true },
      _meta: ui,
    },
    ({ product, design: input, pairings, sample }) => {
      const resolved = resolveDesign(input)
      const fonts = resolvePairings(pairings)
      if (!resolved.ok || !fonts.ok)
        return failure([
          ...(resolved.ok ? [] : resolved.problems),
          ...(fonts.ok ? [] : fonts.problems),
        ])
      return card(
        `Showing ${pairings.length} type pairings for ${product}. The user picks in the card; wait for their message.`,
        {
          card: "type",
          product,
          sample,
          design: resolved.value,
          pairings: fonts.value.map((pairing) => ({
            ...pairing,
            axes: pairingAxes(pairing),
          })),
        },
      )
    },
  )

  registerAppTool(
    server,
    "refine",
    {
      title: "Refine",
      description:
        "Shows the current design and a proposed change side by side, with what changes listed. The user accepts or keeps the current one.",
      inputSchema: {
        product,
        label: z
          .string()
          .min(1)
          .max(40)
          .describe("The change in a few words, e.g. Sharper corners"),
        current: design.describe("The design so far"),
        changes: design.describe(
          "What to change: a new preset or shape, and axes merged over the current ones",
        ),
      },
      annotations: { readOnlyHint: true },
      _meta: ui,
    },
    ({ product, label, current, changes }) => {
      const proposedInput: DesignInput = {
        preset: changes.preset ?? current.preset,
        shape: changes.shape ?? current.shape,
        axes: { ...current.axes, ...changes.axes },
      }
      const from = resolveDesign(current)
      const to = resolveDesign(proposedInput)
      if (!from.ok || !to.ok)
        return failure([
          ...(from.ok ? [] : from.problems.map((p) => `current → ${p}`)),
          ...(to.ok ? [] : to.problems.map((p) => `proposed → ${p}`)),
        ])
      const changed = compareDesigns(from.value, to.value)
      return card(
        `Comparing "${label}" (${changed.length} axes change). If the user accepts, the proposed design is ${JSON.stringify(proposedInput)}.`,
        {
          card: "compare",
          product,
          label,
          current: from.value,
          proposed: to.value,
          changes: changed,
        },
      )
    },
  )

  registerAppTool(
    server,
    "create_design_system",
    {
      title: "Create design system",
      description:
        "Saves the design system and shows the install card: the shadcn command, the studio link to refine it, and Open in v0.",
      inputSchema: { name: z.string().min(1).max(64), ...designShape },
      annotations: { readOnlyHint: false, destructiveHint: false },
      _meta: ui,
    },
    async (input) => {
      const result = await mintDesignSystem(input, getSnapshotStore(), origin)
      if (!result.ok) return failure(result.problems)
      const { diff: _, ...summary } = result.value
      return card(JSON.stringify(summary), {
        card: "ready",
        ...result.value,
      })
    },
  )

  registerAppResource(
    server,
    "dotUI card",
    CARD_URI,
    { description: "Live design-system cards" },
    () => ({
      contents: [
        {
          uri: CARD_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: cardHtml("card", origin),
          _meta: {
            ui: {
              csp: {
                resourceDomains: [
                  origin,
                  "https://fonts.googleapis.com",
                  "https://fonts.gstatic.com",
                ],
              },
              permissions: { clipboardWrite: {} },
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
