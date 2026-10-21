import { useEffect, useMemo, useState } from "react"
import { applyDocumentTheme } from "@modelcontextprotocol/ext-apps"
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps"
import { useApp } from "@modelcontextprotocol/ext-apps/react"
import { Radio, RadioGroup } from "react-aria-components/RadioGroup"

import { DesignSystemProvider } from "@/lib/styles"
import { Button } from "@/registry/ui/button"
import { Loader } from "@/registry/ui/loader"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Controls } from "@/components/showcase/controls"
import { DEFAULT_STATE, salvageState } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"

import type { Direction } from "../directions"
import { Specimen } from "./specimen"

interface Payload {
  product: string
  directions: Direction[]
}

type Mode = "light" | "dark"

const CHROME = designSystemOf(DEFAULT_STATE)

const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as Payload).directions)

/** Sheets fit a phone given the whole screen only: inline, the card's height
 *  is its viewport. The device comes from the host, never the card's width. */
function fitsSheets(host: McpUiHostContext | undefined): boolean {
  if (host?.displayMode !== "fullscreen") return false
  if (host.platform === "mobile") return true
  const device = host.deviceCapabilities
  if (device?.touch !== undefined || device?.hover !== undefined)
    return !!device.touch && device.hover === false
  return matchMedia("(hover: none) and (pointer: coarse)").matches
}

function Themed({
  system,
  mode,
  sheets,
  children,
}: {
  system: DesignSystem
  mode: Mode
  sheets: boolean
  children: React.ReactNode
}) {
  // Otherwise overlays stay anchored and centered whatever the design's
  // mobile choice. Preview only: the picked axes are left as designed.
  const params = useMemo(() => {
    const { componentParams } = system
    if (sheets) return componentParams
    return {
      ...componentParams,
      popover: { ...componentParams.popover, mobile: "anchored" },
      modal: { ...componentParams.modal, mobile: "center" },
    }
  }, [system, sheets])
  return (
    <DesignSystemProvider
      scoped
      params={params}
      tokens={system.tokens}
      density={system.density}
      color={system.color}
      icons={system.icons}
      forcedMode={mode}
    >
      {children}
    </DesignSystemProvider>
  )
}

export function DirectionsCard() {
  const [payload, setPayload] = useState<Payload>()
  const [host, setHost] = useState<McpUiHostContext>()
  const { app, error } = useApp({
    appInfo: { name: "dotUI directions", version: "0.1.0" },
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
  const sheets = fitsSheets(host)
  // color-scheme too: a mismatch with the host's iframe paints the card on
  // an opaque canvas instead of the chat.
  useEffect(() => {
    applyDocumentTheme(hostMode)
    document.documentElement.classList.toggle("dark", hostMode === "dark")
  }, [hostMode])
  const [pinnedMode, setPinnedMode] = useState<Mode>()
  const mode = pinnedMode ?? hostMode

  const entries = useMemo(
    () =>
      payload?.directions.map((direction) => ({
        direction,
        system: designSystemOf(salvageState(direction.diff)),
      })),
    [payload],
  )
  const [picked, setPicked] = useState(0)
  const [sent, setSent] = useState<string>()

  const fullscreen = host?.displayMode === "fullscreen"
  const canFullscreen = host?.availableDisplayModes?.includes("fullscreen")

  async function confirm() {
    const direction = entries?.[picked]?.direction
    if (!app || !direction) return
    // The exact axes travel as context; the message itself stays human.
    await app
      .updateModelContext({
        structuredContent: { picked: direction.name, axes: direction.diff },
      })
      .catch(() => {})
    await app.sendMessage({
      role: "user",
      content: [{ type: "text", text: `Let's go with "${direction.name}".` }],
    })
    setSent(direction.name)
  }

  let body: React.ReactNode
  if (error) {
    body = <p className="text-sm text-fg-muted">{error.message}</p>
  } else if (!payload || !entries?.[picked]) {
    body = (
      <div className="flex items-center gap-2 py-10 text-sm text-fg-muted">
        <Loader className="size-4" />
        Preparing directions…
      </div>
    )
  } else {
    const chosen = entries[picked]
    body = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {payload.directions.length} directions for {payload.product}
          </p>
          <SegmentedControl
            aria-label="Preview mode"
            selectedKeys={[mode]}
            onSelectionChange={(keys) =>
              setPinnedMode([...keys][0] as Mode | undefined)
            }
          >
            <SegmentedControlItem id="light">Light</SegmentedControlItem>
            <SegmentedControlItem id="dark">Dark</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <RadioGroup
          aria-label="Directions"
          value={String(picked)}
          onChange={(value) => setPicked(Number(value))}
          isDisabled={!!sent}
          className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3"
        >
          {entries.map(({ direction, system }, i) => (
            <Radio
              key={direction.name}
              value={String(i)}
              className="flex cursor-pointer flex-col gap-2 rounded-xl border p-1.5 outline-none data-focus-visible:ring-2 data-focus-visible:ring-primary data-selected:border-primary data-selected:ring-1 data-selected:ring-primary"
            >
              <Themed system={system} mode={mode} sheets={sheets}>
                <Specimen product={payload.product} />
              </Themed>
              <span className="flex flex-col gap-0.5 px-1.5 pb-1">
                <span className="text-sm font-medium">{direction.name}</span>
                <span className="text-xs text-fg-muted">
                  {direction.summary}
                </span>
              </span>
            </Radio>
          ))}
        </RadioGroup>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-fg-muted">
            {chosen.direction.name}, live: every control works
          </p>
          <Themed system={chosen.system} mode={mode} sheets={sheets}>
            <div className="rounded-xl bg-bg p-3">
              <Controls className="mx-auto max-w-sm" />
            </div>
          </Themed>
        </div>

        <div className="flex items-center justify-end gap-2">
          {canFullscreen && (
            <Button
              variant="quiet"
              onPress={() =>
                app?.requestDisplayMode({
                  mode: fullscreen ? "inline" : "fullscreen",
                })
              }
            >
              {fullscreen ? "Exit full screen" : "Full screen"}
            </Button>
          )}
          <Button variant="primary" isDisabled={!!sent} onPress={confirm}>
            {sent ? `Picked ${sent}` : `Continue with ${chosen.direction.name}`}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DesignSystemProvider
      params={CHROME.componentParams}
      tokens={CHROME.tokens}
      density={CHROME.density}
      color={CHROME.color}
      icons={CHROME.icons}
    >
      <div className="p-1 text-fg">{body}</div>
    </DesignSystemProvider>
  )
}
