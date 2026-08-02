import { startTransition, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
} from 'lucide-react'

import { siteConfig } from '@/config/site'
import { DesignSystemProvider } from '@/lib/styles'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button, LinkButton } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { DEFAULTS } from '@/modules/create/preset'
import {
  buildInitCommands,
  PACKAGE_MANAGERS,
  packageManagerStore,
} from '@/modules/docs/install-commands'
import type { PackageManager } from '@/modules/docs/install-commands'
import { PillBacklight } from '@/modules/marketing/pill-backlight'
import {
  presetLabelStack,
  usePresetLabelFonts,
} from '@/modules/marketing/preset-fonts'
import { PRESETS } from '@/modules/presets/presets-data'
import type { Preset } from '@/modules/presets/presets-data'

/**
 * Closing CTA: the whole pitch reduced to one headline and one command. The
 * command is the protagonist — picking a preset re-themes the section live
 * (scoped provider, same machinery as the showcase) and bakes the preset into
 * the copied `init` URL. The editor is the quiet second path underneath.
 */
export function CtaSection() {
  const [presetId, setPresetId] = useState<string | null>('origin')
  const preset = PRESETS.find((p) => p.id === presetId) ?? null
  const ds = preset?.designSystem ?? DEFAULTS

  return (
    <section className="relative overflow-x-clip">
      {/* Density is pinned rather than taken from the preset: it's the one axis
          that resizes the pill, and a command that changes height mid-switch
          reads as a layout glitch instead of a re-theme. */}
      <DesignSystemProvider
        scoped
        params={ds.componentParams}
        tokens={ds.tokens}
        density="default"
        color={ds.color}
        icons={ds.icons}
      >
        <div className="container flex flex-col items-center text-center">
          <h2 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-3xl leading-tight font-normal tracking-[-0.05em] text-balance text-fg antialiased sm:text-5xl">
            <span className="block">Your design system,</span>
            <span className="block text-fg-muted">one command away.</span>
          </h2>
          <div className="mt-10 max-w-full">
            <InstallCommand
              preset={preset}
              onSelectPreset={(id) => startTransition(() => setPresetId(id))}
            />
          </div>
          <LinkButton
            href="/create"
            variant="quiet"
            size="sm"
            className="group mt-6 rounded-full text-fg-muted hover:text-fg"
          >
            or build your own in the editor
            <ArrowRightIcon
              data-icon-end=""
              className="transition-transform group-hover:translate-x-0.5"
            />
          </LinkButton>
        </div>
      </DesignSystemProvider>
    </section>
  )
}

/** How much of the encoded preset blob the display keeps before the ellipsis. */
const BLOB_PREVIEW_CHARS = 8

function InstallCommand({
  preset,
  onSelectPreset,
}: {
  preset: Preset | null
  onSelectPreset: (id: string | null) => void
}) {
  const packageManager = packageManagerStore.useValue()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const encoded = useEncodedPreset(preset)
  const pillRef = useRef<HTMLDivElement>(null)

  usePresetLabelFonts()

  const baseUrl = `${siteConfig.url}/r/init`
  // The encoded preset is a few hundred chars — display it truncated, copy it
  // whole. No param while the codec loads or when the preset is the builder
  // defaults (`''` — the plain URL already is that preset).
  const displayUrl = encoded
    ? `${baseUrl}?preset=${encoded.slice(0, BLOB_PREVIEW_CHARS)}…`
    : baseUrl
  const displayCommand = buildInitCommands(displayUrl)[packageManager]
  // Widest command the slot can show (`yarn dlx` prefix + truncated preset) —
  // an invisible sizer keeps the pill from shifting on preset/pm switches.
  const sizerCommand = buildInitCommands(
    `${baseUrl}?preset=${'M'.repeat(BLOB_PREVIEW_CHARS)}…`,
  ).yarn

  // Async so a copy racing the codec load still gets the full URL.
  const copyCommand = async () => {
    const enc = preset ? await encodePresetCached(preset) : ''
    const url = enc ? `${baseUrl}?preset=${enc}` : baseUrl
    copyToClipboard(buildInitCommands(url)[packageManager])
  }

  return (
    <div
      ref={pillRef}
      className="relative flex max-w-full items-center gap-1 rounded-full border bg-card p-2 shadow-xs motion-safe:transition-[--cta-glow-color] motion-safe:duration-700"
      style={
        {
          '--cta-glow-color': preset ? preset.swatch : 'var(--color-fg)',
        } as CSSProperties
      }
    >
      {/* The shader field around the pill: -z-stacked, so it paints behind the
          pill's own background and the section's text (the pill is not a
          stacking context). Its loop also drives the ring glow below. */}
      <PillBacklight
        pillRef={pillRef}
        color={preset?.swatch ?? null}
        className="-inset-x-64 -inset-y-40 -z-10 opacity-50"
      />
      <PillGlow />
      <Menu>
        <Button
          size="sm"
          variant="quiet"
          className="w-30 rounded-full text-xs"
          style={
            preset ? { fontFamily: presetLabelStack(preset.id) } : undefined
          }
        >
          {preset ? (
            <>
              <PresetSwatch color={preset.swatch} />
              {preset.name}
            </>
          ) : (
            <span className="text-fg-muted">Preset</span>
          )}
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover placement="bottom start">
          <MenuContent
            aria-label="Preset"
            selectionMode="single"
            selectedKeys={preset ? [preset.id] : []}
            onSelectionChange={(keys) => {
              if (keys === 'all') return
              // Re-selecting the active preset clears it back to plain dotUI.
              const next = keys.values().next().value
              onSelectPreset(typeof next === 'string' ? next : null)
            }}
          >
            {PRESETS.map((p) => (
              <MenuItem
                key={p.id}
                id={p.id}
                className="text-xs"
                style={{ fontFamily: presetLabelStack(p.id) }}
              >
                <PresetSwatch color={p.swatch} />
                {p.name}
              </MenuItem>
            ))}
          </MenuContent>
        </Popover>
      </Menu>
      <div aria-hidden className="h-4 w-px shrink-0 bg-border" />
      <Menu>
        <Button
          size="sm"
          variant="quiet"
          className="w-17 rounded-full font-mono text-xs text-fg-muted"
        >
          {packageManager}
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover placement="bottom start">
          <MenuContent
            aria-label="Package manager"
            selectionMode="single"
            selectedKeys={[packageManager]}
            onSelectionChange={(keys) => {
              if (keys === 'all') return
              const next = keys.values().next().value
              if (typeof next === 'string') {
                packageManagerStore.set(next as PackageManager)
              }
            }}
          >
            {PACKAGE_MANAGERS.map((pm) => (
              <MenuItem key={pm} id={pm} className="font-mono text-xs">
                {pm}
              </MenuItem>
            ))}
          </MenuContent>
        </Popover>
      </Menu>
      <div aria-hidden className="h-4 w-px shrink-0 bg-border" />
      <code className="no-scrollbar min-w-0 overflow-x-auto px-1.5 text-left font-mono text-[0.8125rem] whitespace-nowrap">
        {/* Invisible widest-case line: sets the slot width once so the visible
            command never resizes the pill. */}
        <span aria-hidden className="invisible block h-0">
          $ {sizerCommand}
        </span>
        <span className="block">
          <span className="text-fg-muted select-none">$ </span>
          {displayCommand}
        </span>
      </code>
      <Button
        size="sm"
        isIconOnly
        variant="quiet"
        aria-label="Copy install command"
        onPress={() => void copyCommand()}
        className="rounded-full text-fg-muted"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

/** Glow position on the pill border, set by PillBacklight (border-box px). */
const GLOW_X = 'var(--cta-glow-x, 50%)'
const GLOW_Y = 'var(--cta-glow-y, 0px)'
/** Only the border ring: two full-cover mask layers, content-box excluded. */
const RING_MASK: CSSProperties = {
  maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  maskClip: 'content-box, border-box',
  maskComposite: 'exclude',
}

/**
 * Accent glow on the pill border: a hot core over a wider falloff, plus a
 * blurred halo bleeding past the edge. Both are masked to a ring so only the
 * border lights up; `--cta-glow-boost` (0–1) brightens them near the cursor.
 */
function PillGlow() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full p-px"
        style={{
          ...RING_MASK,
          background: `radial-gradient(4rem circle at ${GLOW_X} ${GLOW_Y}, var(--cta-glow-color), transparent 70%), radial-gradient(9rem circle at ${GLOW_X} ${GLOW_Y}, color-mix(in oklab, var(--cta-glow-color) 55%, transparent), transparent 70%)`,
          opacity: 'calc(0.8 + 0.2 * var(--cta-glow-boost, 0))',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-full p-1 blur-xs"
        style={{
          ...RING_MASK,
          background: `radial-gradient(5rem circle at calc(${GLOW_X} + 3px) calc(${GLOW_Y} + 3px), color-mix(in oklab, var(--cta-glow-color) 45%, transparent), transparent 70%)`,
          opacity: 'calc(0.5 + 0.4 * var(--cta-glow-boost, 0))',
        }}
      />
    </>
  )
}

function PresetSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-2.5 shrink-0 rounded-full ring-1 ring-current/20 ring-inset"
      style={{ background: color }}
    />
  )
}

/**
 * Encoded `?preset=` blob for the selected preset, loaded lazily: the codec
 * pulls in pako, which has no business in the landing bundle until a preset is
 * actually picked. Cached per preset id.
 */
const encodedCache = new Map<string, string>()

async function encodePresetCached(preset: Preset): Promise<string> {
  const cached = encodedCache.get(preset.id)
  if (cached !== undefined) return cached
  const { encodePreset } = await import('@/modules/create/preset/codec')
  // `undefined` means the preset matches the builder defaults — no param needed.
  const encoded = encodePreset(preset.designSystem) ?? ''
  encodedCache.set(preset.id, encoded)
  return encoded
}

function useEncodedPreset(preset: Preset | null): string | null {
  const [, bump] = useState(0)

  useEffect(() => {
    if (!preset || encodedCache.has(preset.id)) return
    let cancelled = false
    void encodePresetCached(preset).then(() => {
      if (!cancelled) bump((n) => n + 1)
    })
    return () => {
      cancelled = true
    }
  }, [preset])

  return preset ? (encodedCache.get(preset.id) ?? null) : null
}
