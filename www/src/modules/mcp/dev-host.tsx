/* A stand-in MCP Apps host for local work: calls /mcp like Claude would,
   renders the card in a sandboxed iframe under the CSP its resource
   declares, and shows what the card sends back to the "model". */

import { useEffect, useRef, useState } from "react"
import {
  AppBridge,
  buildAllowAttribute,
  getToolUiResourceUri,
  PostMessageTransport,
} from "@modelcontextprotocol/ext-apps/app-bridge"
import type { McpUiResourceMeta } from "@modelcontextprotocol/ext-apps/app-bridge"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

import { Button } from "@/registry/ui/button"

const WARM = {
  preset: "claude",
  axes: { brand: "#e8590c", headingFont: "Fraunces", style: "tonal" },
}

const SAMPLES: Record<string, Record<string, unknown>> = {
  propose_directions: {
    product: "Lumen",
    directions: [
      {
        name: "Quiet ledger",
        summary: "Flat and crisp, black buttons, teal accents",
        preset: "vercel",
        axes: { brand: "#0f766e" },
      },
      {
        name: "Warm studio",
        summary: "Tonal surfaces, soft corners, serif headings",
        ...WARM,
      },
      {
        name: "Precise tool",
        summary: "Tactile controls, sharp corners, compact",
        preset: "linear",
        shape: "sharp",
        axes: {
          style: "tactile",
          density: "compact",
          bodyFont: "IBM Plex Sans",
          iconLibrary: "phosphor",
        },
      },
    ],
  },
  ask_color: {
    product: "Lumen",
    design: WARM,
    candidates: [
      { color: "#e8590c", label: "Logo orange" },
      { color: "#b5451b", label: "Rust" },
      { color: "#2f6f5e", label: "Ledger green" },
      { color: "oklch(0.55 0.2 265)", label: "Indigo" },
    ],
  },
  ask_type: {
    product: "Lumen",
    design: WARM,
    sample: "Get paid on time, without chasing anyone.",
    pairings: [
      { name: "Editorial", heading: "Fraunces", body: "Inter" },
      { name: "Humanist", heading: "Instrument Sans", body: "Instrument Sans" },
      {
        name: "Technical",
        heading: "IBM Plex Sans",
        body: "IBM Plex Sans",
        mono: "JetBrains Mono",
      },
    ],
  },
  refine: {
    product: "Lumen",
    label: "Sharper corners",
    current: WARM,
    changes: { shape: "sharp" },
  },
  create_design_system: { name: "Lumen", ...WARM },
}

const TOOLS = Object.keys(SAMPLES)

// The spec's default policy, opened to the declared domains.
function withCsp(html: string, csp: McpUiResourceMeta["csp"] = {}) {
  const resources = (csp.resourceDomains ?? []).join(" ")
  const connect = (csp.connectDomains ?? []).join(" ")
  const policy = [
    "default-src 'none'",
    `script-src 'unsafe-inline' ${resources}`,
    `style-src 'unsafe-inline' ${resources}`,
    `font-src ${resources}`,
    `img-src data: ${resources}`,
    `connect-src ${connect}`,
  ].join("; ")
  return html.replace(
    "<head>",
    `<head><meta http-equiv="Content-Security-Policy" content="${policy}">`,
  )
}

type Entry = { kind: string; text: string }

const DEVICES = {
  desktop: {
    platform: "desktop",
    deviceCapabilities: { touch: false, hover: true },
  },
  phone: {
    platform: "mobile",
    deviceCapabilities: { touch: true, hover: false },
  },
} as const

export function DevHost() {
  const [tool, setTool] = useState("propose_directions")
  const [args, setArgs] = useState(JSON.stringify(SAMPLES[tool], null, 2))
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop")
  const [fullscreen, setFullscreen] = useState(false)
  const [height, setHeight] = useState(240)
  const [log, setLog] = useState<Entry[]>([])
  const [run, setRun] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)
  const bridge = useRef<AppBridge | null>(null)
  const push = (kind: string, text: string) =>
    setLog((prev) => [...prev, { kind, text }])

  useEffect(() => {
    bridge.current?.sendHostContextChange({
      theme,
      ...DEVICES[device],
      displayMode: fullscreen ? "fullscreen" : "inline",
    })
  }, [theme, device, fullscreen])

  useEffect(() => {
    const iframe = frame.current
    const view = iframe?.contentWindow
    if (run === 0 || !iframe || !view) return
    let cancelled = false
    void (async () => {
      const client = new Client({ name: "dotui-dev-host", version: "0.1.0" })
      await client.connect(
        new StreamableHTTPClientTransport(new URL("/mcp", location.origin)),
      )
      const toolArgs = JSON.parse(args) as Record<string, unknown>
      const { tools } = await client.listTools()
      const uri = getToolUiResourceUri(tools.find((t) => t.name === tool) ?? {})
      const result = await client.callTool({ name: tool, arguments: toolArgs })
      push("tool result", JSON.stringify(result.content))
      if (result.isError || cancelled || !uri) return
      const resource = await client.readResource({ uri })
      const content = resource.contents[0] as {
        text: string
        _meta?: { ui?: McpUiResourceMeta }
      }
      const host = new AppBridge(
        client,
        { name: "dotUI dev host", version: "0.1.0" },
        {
          openLinks: {},
          serverTools: {},
          message: { text: {} },
          updateModelContext: { text: {}, structuredContent: {} },
        },
        {
          hostContext: {
            theme,
            ...DEVICES[device],
            displayMode: "inline",
            availableDisplayModes: ["inline", "fullscreen"],
            containerDimensions: { maxWidth: 720, maxHeight: 6000 },
          },
        },
      )
      host.onsizechange = ({ height: next }) => {
        if (next) setHeight(next)
      }
      host.onmessage = async ({ content: blocks }) => {
        push("user message", JSON.stringify(blocks))
        return {}
      }
      host.onupdatemodelcontext = async (params) => {
        push("model context", JSON.stringify(params))
        return {}
      }
      host.onrequestdisplaymode = async ({ mode }) => {
        setFullscreen(mode === "fullscreen")
        return { mode }
      }
      host.onopenlink = async ({ url }) => {
        window.open(url, "_blank", "noopener")
        return {}
      }
      host.oninitialized = () => {
        push("initialized", "")
        void host.sendToolInput({ arguments: toolArgs })
        void host.sendToolResult(
          result as Parameters<AppBridge["sendToolResult"]>[0],
        )
      }
      bridge.current = host
      await host.connect(new PostMessageTransport(view, view))
      iframe.allow = buildAllowAttribute(content._meta?.ui?.permissions)
      iframe.srcdoc = withCsp(content.text, content._meta?.ui?.csp)
    })().catch((error: unknown) => push("error", String(error)))
    return () => {
      cancelled = true
      void bridge.current?.close()
      bridge.current = null
    }
    // oxlint-disable-next-line react/exhaustive-deps -- a run reads the tool and arguments as they are when Run is pressed
  }, [run])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 lg:flex-row">
      <div className="flex w-full flex-col gap-3 lg:w-80 lg:shrink-0">
        <h1 className="text-lg font-semibold">MCP App dev host</h1>
        <select
          aria-label="Tool"
          value={tool}
          onChange={(e) => {
            setTool(e.target.value)
            setArgs(JSON.stringify(SAMPLES[e.target.value], null, 2))
          }}
          className="h-9 rounded-md border bg-card px-2 text-sm"
        >
          {TOOLS.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <textarea
          aria-label="Tool arguments"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          spellCheck={false}
          className="h-80 rounded-lg border bg-card p-2 font-mono text-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onPress={() => {
              setLog([])
              setRun((n) => n + 1)
            }}
          >
            Run
          </Button>
          <Button
            onPress={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Host: {theme}
          </Button>
          <Button
            onPress={() =>
              setDevice(device === "desktop" ? "phone" : "desktop")
            }
          >
            Device: {device}
          </Button>
        </div>
        <ol className="flex flex-col gap-2 text-xs">
          {log.map((entry, i) => (
            <li key={i} className="rounded-md border p-2">
              <span className="font-medium">{entry.kind}</span>
              <pre className="mt-1 break-all whitespace-pre-wrap text-fg-muted">
                {entry.text}
              </pre>
            </li>
          ))}
        </ol>
      </div>
      <div
        className={
          fullscreen
            ? "fixed inset-0 z-50 overflow-auto bg-bg p-6"
            : "w-full max-w-[720px] self-start rounded-2xl border p-3"
        }
        // Claude's chat surfaces, so the card is judged on what it sits on.
        style={{
          background: theme === "light" ? "#faf9f5" : "#262624",
          colorScheme: theme,
        }}
      >
        <iframe
          ref={frame}
          title="Card"
          // Real hosts give the card its own origin (Claude:
          // <hash>.claudemcpcontent.com). An opaque one can't reach localhost
          // at all (Chrome's Local Network Access), so share ours.
          sandbox="allow-scripts allow-same-origin"
          className="w-full"
          style={{ height }}
        />
      </div>
    </div>
  )
}
