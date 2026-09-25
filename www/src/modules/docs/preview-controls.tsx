"use client"

import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { ChevronsUpDownIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "starter-themes"

import { createPersistedStore } from "@/lib/persisted-store"
import { DesignSystemProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { Button, type ButtonProps } from "@/registry/ui/button"
import { Loader } from "@/registry/ui/loader"
import { resolvePreset } from "@/modules/presets"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { pickerSections, rowSelection } from "@/modules/studio/picker-sections"
import type { DesignSystem } from "@/modules/studio/preset"
import { resolveDesignSystem } from "@/modules/studio/resolve"
import { select, useCurrent } from "@/modules/studio/selection"
import { useWorkspace } from "@/modules/studio/workspace"

/**
 * The docs previews render the current design system (see
 * studio/selection.ts), shared with the studio and every tab, and the
 * light/dark mode. The mode defaults to the site theme until the user picks
 * one, then pins previews to that choice.
 */

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
  "transition-opacity duration-200 in-data-preview-pending:opacity-0"

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
      className="absolute inset-0 z-20 hidden items-center justify-center rounded-[inherit] bg-bg in-data-preview-pending:flex"
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

/** The design system the docs previews render in. */
export function useResolvedPreset(): DesignSystem {
  const { sel, state } = useCurrent()
  const own = useMemo(() => resolveDesignSystem(state), [state])
  return sel.kind === "preset" ? resolvePreset(sel.id) : own
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
}: {
  variant?: ButtonProps["variant"]
}) {
  const current = useCurrent()
  const workspace = useWorkspace()
  const previewMode = useForcedPreviewMode()
  const sections = useMemo(
    () => pickerSections(current, workspace),
    [current, workspace],
  )

  return (
    <PresetPicker
      selectedId={current.key}
      onPick={(item) => select(rowSelection(item.id, current))}
      previewMode={previewMode}
      withPreview
      sections={sections}
    >
      <Button
        variant={variant}
        size="sm"
        aria-label="Preview design system"
        className="gap-1.5"
      >
        <PresetSwatch color={current.swatch} />
        <span dir="auto" className="max-w-35 truncate">
          {current.name}
        </span>
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
 * The intro on gallery pages (frontmatter `preview`): the preset picker sits
 * in the sentence so it reads as copy, not a toolbar. Same store as every
 * per-demo toolbar.
 */
export function PagePreviewControls() {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-fg-muted">
      You&apos;re looking at
      <PresetSelector variant="secondary" />
      design system.
    </p>
  )
}
