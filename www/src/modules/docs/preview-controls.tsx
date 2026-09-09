"use client"

import {
  useEffect,
  useId,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { ChevronsUpDownIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "starter-themes"

import { createPersistedStore, enumCodec } from "@/lib/persisted-store"
import { DesignSystemProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { Button, type ButtonProps } from "@/registry/ui/button"
import { Loader } from "@/registry/ui/loader"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { ORIGIN, PRESETS } from "@/modules/presets/presets-data"
import type { DesignSystem } from "@/modules/studio/preset"
import {
  DEFAULT_DESIGN_SYSTEM_NAME,
  useDesignSystemName,
  useStoredPreset,
} from "@/modules/studio/preset/storage"
import { resolveDesignSystem } from "@/modules/studio/resolve"

/**
 * Which design system and light/dark mode the docs previews render in. Global
 * and persisted, so every demo on the site stays in sync; `yours` is the design
 * system built at /create. The mode defaults to the site theme until the user
 * picks one, then pins previews to that choice.
 */

const YOURS = "yours"

const presetStore = createPersistedStore(
  "dotui:preview-preset",
  "claude",
  enumCodec([YOURS, ...PRESETS.map((p) => p.id)], "claude"),
)

type PreviewMode = "light" | "dark"

const modeStore = createPersistedStore<PreviewMode | null>(
  "dotui:preview-mode",
  null,
  {
    decode: (raw) => (raw === "light" || raw === "dark" ? raw : null),
    encode: (mode) => mode,
  },
)

/**
 * Whether the SSR'd previews still show the wrong preset/mode — true only when
 * the pre-paint script flagged a stored selection (see preview-pending.ts), so
 * first-time visitors keep the instant SSR previews. Clears the flag once the
 * re-render with the stored selection commits, so nothing flashes the wrong
 * preset and later navigations never wait.
 */
export function usePreviewPending() {
  const hydrated = useHydrated()
  useEffect(() => {
    if (hydrated)
      document.documentElement.removeAttribute("data-preview-pending")
  }, [hydrated])
  return !hydrated
}

/**
 * Hides pending preview content in place, for previews whose frame should stay
 * visible while the preset resolves (the component cards). The container must
 * call usePreviewPending() to clear the flag.
 */
export const previewPendingClass =
  "transition-opacity duration-200 [[data-preview-pending]_&]:opacity-0"

/**
 * Covers a preview until hydration applies the stored preset/mode. Rendered on
 * every load but only visible (via CSS) while pending. Drop inside any
 * `relative` preview container that isn't wrapped in PreviewPanel.
 */
export function PreviewVeil() {
  if (!usePreviewPending()) return null
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-20 hidden items-center justify-center rounded-[inherit] bg-bg [[data-preview-pending]_&]:flex"
    >
      <Loader />
    </div>
  )
}

/** `resolvedTheme` reads the client theme during hydration, so SSR must ignore it. */
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

/** The stored choice, else the site theme; undefined until that is known. */
function usePreviewMode(): PreviewMode | undefined {
  const hydrated = useHydrated()
  const stored = modeStore.useValue()
  const { resolvedTheme } = useTheme()
  if (stored) return stored
  if (!hydrated) return undefined
  return resolvedTheme === "dark" || resolvedTheme === "light"
    ? resolvedTheme
    : undefined
}

/** The mode previews must pin, or undefined when the site theme already provides it. */
export function useForcedPreviewMode(): PreviewMode | undefined {
  const mode = usePreviewMode()
  const { resolvedTheme } = useTheme()
  return mode === undefined || mode === resolvedTheme ? undefined : mode
}

/** The design system the docs previews render in, resolved from the selection. */
export function useResolvedPreset(): DesignSystem {
  const selected = presetStore.useValue()
  const yours = useStoredPreset()
  const yoursResolved = useMemo(() => resolveDesignSystem(yours.state), [yours])
  if (selected === YOURS) return yoursResolved
  return (
    PRESETS.find((p) => p.id === selected)?.designSystem ?? ORIGIN.designSystem
  )
}

/**
 * The frame around a docs preview: pins the whole panel — toolbar included — to
 * the selected preview mode, staying in the site design system. The preset only
 * applies inside DemoPreset, so the toolbar switches mode but never re-themes.
 */
export function PreviewPanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <DesignSystemProvider forcedMode={useForcedPreviewMode()} scoped>
      {/* `relative` anchors the absolutely-positioned PreviewControls toolbar. */}
      <div className={cn("relative bg-bg", className)}>
        {children}
        <PreviewVeil />
      </div>
    </DesignSystemProvider>
  )
}

function PresetSwatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-3 shrink-0 rounded-full border border-border",
        className,
      )}
      style={{ background: color }}
    />
  )
}

function PresetSelector({
  variant = "quiet",
  labelId,
}: {
  variant?: ButtonProps["variant"]
  /** An external caption; the trigger's name then reads caption + value. */
  labelId?: string
}) {
  const valueId = useId()
  const selected = presetStore.useValue()
  const previewMode = useForcedPreviewMode()
  const yours = useStoredPreset()
  const yoursDesignSystem = useMemo(
    () => resolveDesignSystem(yours.state),
    [yours],
  )
  const yoursName = useDesignSystemName().trim() || DEFAULT_DESIGN_SYSTEM_NAME
  const yoursSwatch = yours.state.brand
  const selectedName =
    selected === YOURS
      ? yoursName
      : (PRESETS.find((p) => p.id === selected)?.name ?? yoursName)
  const selectedSwatch =
    selected === YOURS
      ? yoursSwatch
      : (PRESETS.find((p) => p.id === selected)?.swatch ?? yoursSwatch)

  return (
    <PresetPicker
      selectedId={selected}
      onPick={(item) => presetStore.set(item.id)}
      previewMode={previewMode}
      sections={[
        {
          id: "yours",
          title: "Yours",
          items: [
            {
              id: YOURS,
              name: yoursName,
              designSystem: yoursDesignSystem,
            },
          ],
        },
        {
          id: "built-in",
          title: "Presets",
          items: PRESETS.map((preset) => ({
            id: preset.id,
            name: preset.name,
            designSystem: preset.designSystem,
          })),
        },
      ]}
    >
      <Button
        variant={variant}
        size="sm"
        aria-label={labelId ? undefined : "Preview design system"}
        aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
        className="gap-1.5"
      >
        <PresetSwatch color={selectedSwatch} />
        <span id={valueId}>{selectedName}</span>
        <ChevronsUpDownIcon className="size-3.5! text-fg-muted" />
      </Button>
    </PresetPicker>
  )
}

function PreviewModeToggle({
  variant = "quiet",
  className,
}: {
  variant?: ButtonProps["variant"]
  className?: string
}) {
  const stored = modeStore.useValue()
  const mode = usePreviewMode() ?? "light"
  const next = mode === "light" ? "dark" : "light"

  return (
    <Tooltip>
      <Button
        variant={variant}
        size="sm"
        isIconOnly
        aria-label={`Switch preview to ${next} mode`}
        className={cn(variant === "quiet" && "text-fg-muted", className)}
        onPress={() => modeStore.set(next)}
      >
        {/* Without a stored choice the mode is the site theme, which only CSS knows during SSR. */}
        {stored === "dark" ? (
          <MoonIcon />
        ) : stored === "light" ? (
          <SunIcon />
        ) : (
          <>
            <SunIcon className="block dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </>
        )}
      </Button>
      <TooltipContent>Switch to {next} mode</TooltipContent>
    </Tooltip>
  )
}

/**
 * The toolbar over each docs preview: preset selector left, mode toggle right.
 * Absolutely positioned so it overlays the canvas instead of taking its own row.
 * Click-transparent outside its controls, so it never blocks the canvas or
 * siblings layered under the strip (e.g. the playground's controls trigger).
 */
export function PreviewControls({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-2 pt-2 *:pointer-events-auto",
        className,
      )}
    >
      <PresetSelector />
      <PreviewModeToggle />
    </div>
  )
}

/**
 * The page-level toolbar of gallery pages (frontmatter `preview`): a captioned
 * preset field and a mode toggle, right-aligned under the page header. Same
 * store, so it stays in sync with every per-demo toolbar.
 */
export function PagePreviewControls() {
  const labelId = useId()
  return (
    <div className="flex items-end justify-end gap-3">
      <div className="flex flex-col gap-1.5">
        <span id={labelId} className="text-xs text-fg-muted">
          Preset
        </span>
        <PresetSelector variant="secondary" labelId={labelId} />
      </div>
      <PreviewModeToggle variant="secondary" />
    </div>
  )
}
