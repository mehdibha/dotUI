'use client'

import { useMemo, useState } from 'react'
import { RotateCcwIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_SEMANTICS,
  resolveColorConfig,
} from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorField } from '@/registry/ui/color-field'
// `Dialog` is the react-aria DialogTrigger wrapper; pairs a trigger Button with
// the Popover + DialogContent below it.
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'

import { useDesignSystem } from '../../preset'
import { Swatch } from '../primitives'

const PALETTES = [
  'neutral',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
] as const
type Palette = (typeof PALETTES)[number]

const PALETTE_LABEL: Record<Palette, string> = {
  neutral: 'Neutral',
  accent: 'Brand',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
}

/**
 * The semantic roles worth repointing — the high-impact 12. Each writes the live
 * `--color-<role>` token, which the preview applies inline on `:root`, overriding
 * the emitted semantic layer. Repointing one is genuinely live, not a stub.
 */
const GROUPS: Array<{
  title: string
  roles: Array<{ key: string; label: string }>
}> = [
  {
    title: 'Surfaces',
    roles: [
      { key: 'color-bg', label: 'Background' },
      { key: 'color-card', label: 'Card' },
      { key: 'color-primary', label: 'Primary' },
      { key: 'color-accent', label: 'Accent' },
    ],
  },
  {
    title: 'Text & borders',
    roles: [
      { key: 'color-fg', label: 'Text' },
      { key: 'color-fg-muted', label: 'Muted text' },
      { key: 'color-border', label: 'Border' },
      { key: 'color-border-focus', label: 'Focus ring' },
    ],
  },
  {
    title: 'Status',
    roles: [
      { key: 'color-danger', label: 'Danger' },
      { key: 'color-success', label: 'Success' },
      { key: 'color-warning', label: 'Warning' },
      { key: 'color-info', label: 'Info' },
    ],
  },
]

/** The palettes a role is allowed to point at, from its authored `scales` pool. */
function palettesFor(key: string): Palette[] {
  const scales = (
    DEFAULT_SEMANTICS as Record<string, { scales?: readonly string[] }>
  )[key]?.scales
  if (!scales) return ['neutral']
  const set = new Set(
    scales.filter((s): s is Palette =>
      (PALETTES as readonly string[]).includes(s),
    ),
  )
  // `..` in a pool means "any custom palette is allowed" — surface the brand as
  // the useful extra so neutral surfaces can be tinted toward it.
  if (scales.includes('..')) set.add('accent')
  const list = PALETTES.filter((p) => set.has(p))
  return list.length > 0 ? list : ['neutral']
}

/** The default palette + step a role resolves to out of the box. */
function defaultRef(key: string): { palette: Palette; step: string } {
  const ref = (
    DEFAULT_SEMANTICS as Record<string, { target?: { ref?: string } }>
  )[key]?.target?.ref
  const m = ref?.match(/^([a-z]+)-(\d+)$/)
  const pal = m?.[1]
  const step = m?.[2]
  if (pal && step && (PALETTES as readonly string[]).includes(pal)) {
    return { palette: pal as Palette, step }
  }
  return { palette: 'neutral', step: '500' }
}

export function SemanticTokens() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const steps = resolved.steps

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-snug text-fg-muted">
        Repoint any role to a different palette and step. Changes apply to the
        preview instantly.
      </p>
      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium tracking-wider text-fg-muted/70 uppercase">
            {group.title}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {group.roles.map((role) => (
              <SemanticRow
                key={role.key}
                roleKey={role.key}
                label={role.label}
                resolved={resolved}
                steps={steps}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SemanticRow({
  roleKey,
  label,
  resolved,
  steps,
}: {
  roleKey: string
  label: string
  resolved: ReturnType<typeof resolveColorConfig>
  steps: string[]
}) {
  const { designSystem, setToken, setDesignSystem } = useDesignSystem()
  const cssVar = `--${roleKey}`
  const override = designSystem.tokens[cssVar]

  // An override is either a palette reference (`var(--accent-500)`) or a literal
  // brand color (`#ff0066`) — both are valid inline `:root` values the preview
  // applies live. A non-`var()` override is the custom-hex path.
  const isCustom = Boolean(override) && !override?.startsWith('var(')
  const customHex = isCustom ? (override ?? '#000000') : '#000000'

  const parsed = override?.match(/var\(--([a-z]+)-(\d+)\)/)
  const parsedPal = parsed?.[1]
  const parsedStep = parsed?.[2]
  const fallback = defaultRef(roleKey)
  const current: { palette: Palette; step: string } =
    parsedPal &&
    parsedStep &&
    (PALETTES as readonly string[]).includes(parsedPal)
      ? { palette: parsedPal as Palette, step: parsedStep }
      : fallback
  const isOverridden = Boolean(override)

  const palettes = palettesFor(roleKey)
  const [viewPalette, setViewPalette] = useState<Palette>(current.palette)

  const swatchColor = isCustom
    ? customHex
    : (resolved.light[current.palette as keyof typeof resolved.light]?.[
        current.step
      ] ?? '#888')

  function pick(palette: Palette, step: string) {
    setToken(cssVar, `var(--${palette}-${step})`)
  }
  function reset() {
    setDesignSystem((prev) => {
      if (!(cssVar in prev.tokens)) return prev
      const next = { ...prev.tokens }
      delete next[cssVar]
      return { ...prev, tokens: next }
    })
  }

  return (
    <Dialog>
      <Button
        size="sm"
        variant="default"
        className={cn(
          'h-auto justify-start gap-2 py-1.5 pl-2',
          isOverridden && 'border-border-focus',
        )}
      >
        <Swatch color={swatchColor} className="size-4" />
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="truncate text-[12px] font-medium">{label}</span>
          <span className="font-mono text-[9px] text-fg-muted">
            {isCustom
              ? customHex.toUpperCase()
              : `${current.palette}-${current.step}`}
          </span>
        </span>
      </Button>
      <Popover>
        <DialogContent className="flex w-60 flex-col gap-3 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">{label}</span>
            {isOverridden && (
              <Button
                size="xs"
                variant="quiet"
                onPress={reset}
                className="text-fg-muted"
              >
                <RotateCcwIcon data-icon-start="" />
                Reset
              </Button>
            )}
          </div>

          {palettes.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {palettes.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setViewPalette(p)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[11px] focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring',
                    viewPalette === p
                      ? 'border-border-focus bg-neutral'
                      : 'text-fg-muted',
                  )}
                >
                  <Swatch
                    color={
                      resolved.light[p as keyof typeof resolved.light]?.[
                        '500'
                      ] ?? '#888'
                    }
                    className="size-3"
                  />
                  {PALETTE_LABEL[p]}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-6 gap-1">
            {steps.map((step) => {
              const color =
                resolved.light[viewPalette as keyof typeof resolved.light]?.[
                  step
                ] ?? '#888'
              const isCurrent =
                !isCustom &&
                current.palette === viewPalette &&
                current.step === step
              return (
                <button
                  key={step}
                  type="button"
                  aria-label={`${viewPalette} ${step}`}
                  onClick={() => pick(viewPalette, step)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-md p-0.5 focus-reset transition-transform hover:scale-105 focus-visible:focus-ring',
                    isCurrent && 'ring-2 ring-border-focus',
                  )}
                >
                  <Swatch color={color} className="size-7" />
                  <span className="font-mono text-[8px] text-fg-muted">
                    {step}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom: point the role at an exact brand color, not a generated
              step. A literal hex is a valid inline :root value, so it's live too.
              `key` reseeds the uncontrolled field when the override changes (a
              ramp pick, a reset) so its text stays in sync. */}
          <div className="flex flex-col gap-1.5 border-t pt-2.5">
            <span className="text-[10px] font-medium tracking-wider text-fg-muted/70 uppercase">
              Custom color
            </span>
            <div className="flex items-center gap-2">
              <Swatch color={swatchColor} className="size-7 shrink-0" />
              <ColorField
                key={override ?? 'default'}
                aria-label={`Custom ${label} color`}
                defaultValue={isCustom ? customHex : undefined}
                onChange={(c) => c && setToken(cssVar, c.toString('hex'))}
                className="min-w-0 flex-1"
              >
                <Input size="sm" className="w-full" placeholder="#000000" />
              </ColorField>
            </div>
          </div>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}
