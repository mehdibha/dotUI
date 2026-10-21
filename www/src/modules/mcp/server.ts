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
  resolveDesign,
  resolveDirections,
  SHAPE_VALUES,
} from "./design"
import type { DesignInput } from "./design"

const CARD_URI = "ui://dotui/card.html"
// Hosts cache a tool's resourceUri with its tool list: a card URI is never
// renamed, only added to. v0.1's still resolves to the same card.
const CARD_URIS = [CARD_URI, "ui://dotui/directions.html"]

const INSTRUCTIONS = `dotUI builds a complete design system (color, type, icons, shape, density, surfaces, motion and per-component styles) on accessible React Aria components, and installs it as code the user owns with the shadcn CLI.

You run a short brand interview; the user makes the taste calls in a live card. Ask in words only for facts you can't infer (what the product is, who it's for, how it should feel, products they like); use whatever the conversation, an attached logo or a link already tells you.
1. get_design_axes once: the presets, shapes, fonts and identity axes.
2. propose_directions: three distinct, complete directions, each a preset, optionally a shape, and at most six axes. Give each 3–6 brand colors and 2–4 type pairings that suit it: the user customizes with them in the card.
3. The user picks, customizes and saves inside the card. The card never writes to you: when they next write, what they saved (its id, design and install command) is in your context. Don't ask them to confirm picks in chat.
4. Changes asked in words ("warmer", "rounder"): refine with the saved design as current and the changes; they accept in the card, which saves a new version.
5. Asked to set it up and able to run commands: run the install command from your context. In a host that shows no cards, use create_design_system.

Every design argument is the whole design: { preset, shape, axes }. After a card, reply in one or two sentences: the user is looking at it, so never list or describe what it shows.`

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
const swatches = z
  .array(
    z.object({
      color: z.string().describe("Any CSS color"),
      label: z.string().max(30).optional(),
    }),
  )
  .max(6)
  .optional()
const pairings = z
  .array(
    z.object({
      name: z.string().max(30).optional(),
      heading: z.string().describe("A family from `fonts`"),
      body: z.string().describe("A family from `fonts`"),
      mono: z.string().optional().describe("A family from `fonts`"),
    }),
  )
  .max(4)
  .optional()

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

// What a card result tells the model: the user sees it already, so prose
// only points at it, and their answer comes back as their next message.
const SHOWN = "The user is looking at a live card:"

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
        "Shows two or three complete design-system directions as live previews built from real dotUI components. In the card the user picks one, customizes its color, type, shape and density with the options you give, and saves it.",
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
              colors: swatches.describe(
                "3–6 brand colors that suit this direction",
              ),
              pairings: pairings.describe(
                "2–4 type pairings that suit this direction",
              ),
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
      const names = result.value.map((d) => d.name).join(", ")
      return card(
        `${SHOWN} ${result.value.length} directions for ${product} (${names}). They pick, customize and save in the card; what they save reaches you with their next message.`,
        { card: "directions", product, directions: result.value },
      )
    },
  )

  registerAppTool(
    server,
    "refine",
    {
      title: "Refine",
      description:
        "Shows the current design and a proposed change in one preview the user flips between, with what changes listed. Accepting saves the proposed design as a new version.",
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
        `${SHOWN} "${label}": current vs proposed, ${changed.length} axes change. If they accept, the card saves ${JSON.stringify(proposedInput)} and the new version reaches you with their next message.`,
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

  server.registerTool(
    "save_design",
    {
      title: "Save design",
      description:
        "The card's Save: stores the design the user built and returns the install card.",
      inputSchema: {
        name: z.string().min(1).max(64),
        axes: z.record(z.string(), z.unknown()),
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
      _meta: { ui: { visibility: ["app"] } },
    },
    async ({ name, axes }) => {
      const result = await mintDesignSystem(
        { name, axes },
        getSnapshotStore(),
        origin,
      )
      if (!result.ok) return failure(result.problems)
      return card(`Saved ${result.value.name} as ${result.value.id}.`, {
        card: "ready",
        ...result.value,
      })
    },
  )

  registerAppTool(
    server,
    "create_design_system",
    {
      title: "Create design system",
      description:
        "Saves a design system and shows the install card. For hosts that show no cards; in a card the user saves it themselves.",
      inputSchema: { name: z.string().min(1).max(64), ...designShape },
      annotations: { readOnlyHint: false, destructiveHint: false },
      _meta: ui,
    },
    async (input) => {
      const result = await mintDesignSystem(input, getSnapshotStore(), origin)
      if (!result.ok) return failure(result.problems)
      const { diff: _, ...summary } = result.value
      return card(
        `${SHOWN} the install card for ${summary.name}: the command per package manager, Open in studio and Open in v0. Don't repeat the command; if you can run commands, run it, otherwise offer the next step in a sentence. ${JSON.stringify(summary)}`,
        {
          card: "ready",
          ...result.value,
        },
      )
    },
  )

  for (const uri of CARD_URIS)
    registerAppResource(
      server,
      uri === CARD_URI ? "dotUI card" : "dotUI card (v0.1)",
      uri,
      { description: "Live design-system cards" },
      () => ({
        contents: [
          {
            uri,
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
