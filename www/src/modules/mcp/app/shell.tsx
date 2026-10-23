/* What every card shares: the host connection, the preview mode, scoped
   themes and the way a pick goes back to the model. */

import {
  Children,
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from "react"
import { applyDocumentTheme } from "@modelcontextprotocol/ext-apps"
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps"
import { useApp } from "@modelcontextprotocol/ext-apps/react"
import { Radio, RadioGroup } from "react-aria-components/RadioGroup"

import { DesignSystemProvider } from "@/lib/styles"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { salvageState } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"

import type { Diff, MintedDesignSystem } from "../design"

export type Mode = "light" | "dark"

interface CardContext {
  app: App
  host: McpUiHostContext
  mode: Mode
  setMode: (mode: Mode) => void
  sheets: boolean
}

const Context = createContext<CardContext | null>(null)

export function useCard(): CardContext {
  const context = use(Context)
  if (!context) throw new Error("useCard outside a card")
  return context
}

/** Connects to the host and keeps the tool result and host context. */
export function useHost<P>(isPayload: (value: unknown) => value is P) {
  const [payload, setPayload] = useState<P>()
  const [host, setHost] = useState<McpUiHostContext>()
  const { app, error } = useApp({
    appInfo: { name: "dotUI", version: "0.2.0" },
    capabilities: {},
    onAppCreated: (created) => {
      created.ontoolresult = ({ structuredContent }) => {
        if (isPayload(structuredContent)) setPayload(structuredContent)
      }
      created.onhostcontextchanged = (context) =>
        setHost((prev) => ({ ...prev, ...context }))
    },
  })
  useEffect(() => {
    if (app) setHost(app.getHostContext())
  }, [app])

  const hostMode: Mode = host?.theme === "dark" ? "dark" : "light"
  // color-scheme too: a mismatch with the host's iframe paints the card on
  // an opaque canvas instead of the chat.
  useEffect(() => {
    applyDocumentTheme(hostMode)
    document.documentElement.classList.toggle("dark", hostMode === "dark")
  }, [hostMode])

  return { app, error, payload, host, hostMode }
}

/** Sheets fit a phone given the whole screen only: inline, the card's height
 *  is its viewport. The device comes from the host, never the card's width. */
export function fitsSheets(host: McpUiHostContext | undefined): boolean {
  if (host?.displayMode !== "fullscreen") return false
  if (host.platform === "mobile") return true
  const device = host.deviceCapabilities
  if (device?.touch !== undefined || device?.hover !== undefined)
    return !!device.touch && device.hover === false
  return matchMedia("(hover: none) and (pointer: coarse)").matches
}

export function CardProvider({
  app,
  host,
  hostMode,
  children,
}: {
  app: App
  host: McpUiHostContext | undefined
  hostMode: Mode
  children: React.ReactNode
}) {
  const [pinned, setPinned] = useState<Mode>()
  const value = useMemo(
    () => ({
      app,
      host: host ?? {},
      mode: pinned ?? hostMode,
      setMode: setPinned,
      sheets: fitsSheets(host),
    }),
    [app, pinned, hostMode, host],
  )
  return <Context value={value}>{children}</Context>
}

/** The design system a diff over the defaults resolves to. */
export const useSystem = (diff: Diff): DesignSystem =>
  useMemo(() => designSystemOf(salvageState(diff)), [diff])

/** A subtree in `system`. Unless sheets fit, overlays stay anchored and
 *  centered whatever the design's mobile choice; the design is untouched. */
export function Themed({
  system,
  mode,
  children,
}: {
  system: DesignSystem
  mode?: Mode
  children: React.ReactNode
}) {
  const card = useCard()
  const params = useMemo(() => {
    const { componentParams } = system
    if (card.sheets) return componentParams
    return {
      ...componentParams,
      popover: { ...componentParams.popover, mobile: "anchored" },
      modal: { ...componentParams.modal, mobile: "center" },
    }
  }, [system, card.sheets])
  return (
    <DesignSystemProvider
      scoped
      params={params}
      tokens={system.tokens}
      density={system.density}
      color={system.color}
      icons={system.icons}
      forcedMode={mode ?? card.mode}
    >
      {children}
    </DesignSystemProvider>
  )
}

/** Keeps Claude current without a message: the host hands the latest
 *  context to Claude with the user's next one. Hosts that refuse it lose
 *  nothing the card needs. */
export function tell(
  app: App,
  text: string,
  structuredContent: Record<string, unknown>,
) {
  return app
    .updateModelContext({
      content: [{ type: "text", text }],
      structuredContent,
    })
    .catch(() => {})
}

/** Saves a design through the server's app-only tool and tells Claude what
 *  was saved. Throws when the server refuses it. */
export async function saveDesign(
  app: App,
  name: string,
  diff: Diff,
): Promise<MintedDesignSystem> {
  const result = await app.callServerTool({
    name: "save_design",
    arguments: { name, axes: diff },
  })
  const saved = result.structuredContent as
    | (MintedDesignSystem & { card: "ready" })
    | undefined
  if (result.isError || !saved?.id) {
    const reason = result.content?.[0]
    throw new Error(
      reason?.type === "text" ? reason.text : "The design wasn't saved",
    )
  }
  void tell(
    app,
    `The user saved "${saved.name}" as ${saved.id}. Its design, as axes over the defaults: ${JSON.stringify(diff)}. Install: ${saved.commands.npm}. Studio: ${saved.studioUrl}.`,
    { saved: saved.id, name: saved.name, design: { axes: diff } },
  )
  return saved
}

export function CardHeader({
  title,
  modeSwitch = true,
}: {
  title: string
  modeSwitch?: boolean
}) {
  const { mode, setMode } = useCard()
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm font-medium">{title}</p>
      {modeSwitch && (
        <SegmentedControl
          aria-label="Preview mode"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next === "light" || next === "dark") setMode(next)
          }}
        >
          <SegmentedControlItem id="light">Light</SegmentedControlItem>
          <SegmentedControlItem id="dark">Dark</SegmentedControlItem>
        </SegmentedControl>
      )}
    </div>
  )
}

export function CardActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-2">{children}</div>
}

/** Selectable previews: the whole tile takes the click. */
export function Tiles({
  label,
  value,
  onChange,
  isDisabled,
  children,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  isDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={String(value)}
      onChange={(next) => onChange(Number(next))}
      isDisabled={isDisabled}
      // Four sit two by two: a lone fourth tile reads as an afterthought.
      className={
        Children.count(children) === 4
          ? "grid gap-3 sm:grid-cols-2"
          : "grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3"
      }
    >
      {children}
    </RadioGroup>
  )
}

export function Tile({
  index,
  title,
  description,
  children,
}: {
  index: number
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Radio
      value={String(index)}
      className="flex cursor-pointer flex-col gap-2 rounded-xl border p-1.5 outline-none data-focus-visible:ring-2 data-focus-visible:ring-primary data-selected:border-primary data-selected:ring-1 data-selected:ring-primary"
    >
      {/* Stretches, so titles line up across tiles of different heights. */}
      <div className="grid flex-1">{children}</div>
      <span className="flex flex-col gap-0.5 px-1.5 pb-1">
        <span className="text-sm font-medium">{title}</span>
        {description && (
          <span className="text-xs text-fg-muted">{description}</span>
        )}
      </span>
    </Radio>
  )
}
