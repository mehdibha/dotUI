'use client'

import { ChevronDownIcon, XIcon } from 'lucide-react'

import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_SEMANTICS,
  JOB_STEPS,
  PALETTE_ORDER,
} from '@/registry/theme'
import type { JobName, SemanticToken, TokenTargetSpec } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'

const JOB_NAMES = Object.keys(JOB_STEPS) as JobName[]
const STEP_JOBS = Object.fromEntries(
  Object.entries(JOB_STEPS).map(([job, step]) => [step, job as JobName]),
)

/** Tokens the picker offers: those with a curated ramp pool (T7). */
const REMAPPABLE = Object.entries(DEFAULT_SEMANTICS).filter(
  ([, token]) => token.scales !== undefined,
)

/** Job a fresh override starts at when the default target isn't a plain ref. */
const CATEGORY_JOBS: Record<SemanticToken['category'], JobName> = {
  background: 'ui-rest',
  foreground: 'text',
  border: 'border-subtle',
}

/** A token's starting (palette, job): its own ref target, or a category guess. */
function defaultSpec(
  token: SemanticToken,
  customPalettes: string[],
): TokenTargetSpec | undefined {
  const target = 'light' in token.target ? token.target.light : token.target
  if ('ref' in target) {
    const job = STEP_JOBS[target.ref.step]
    if (job) return { palette: target.ref.palette, job }
  }
  const palette = palettePool(token, customPalettes)[0]
  return palette ? { palette, job: CATEGORY_JOBS[token.category] } : undefined
}

/** The palettes a token's pool offers; `'..'` opens any config-added palette. */
function palettePool(token: SemanticToken, customPalettes: string[]): string[] {
  const pool = token.scales ?? []
  const named = pool.filter((name) => name !== '..')
  const open = pool.includes('..')
  return [...new Set([...named, ...(open ? customPalettes : [])])]
}

/**
 * Per-token remapping (T7 advanced tier): the `scales` picker pools as a UI.
 * Rows write mode-agnostic `{ palette, job }` overrides; per-mode pairs stay
 * expressible at the config/preset level.
 */
export function TokenOverridesSection() {
  const { designSystem, setColorTokenOverride } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const overrides = config.overrides ?? {}
  const customPalettes = Object.keys(config.seeds).filter(
    (name) => !(PALETTE_ORDER as readonly string[]).includes(name),
  )
  const available = REMAPPABLE.filter(([name]) => !(name in overrides))

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-muted">
        Re-point a semantic token at another ramp step. The contrast readout
        below tracks the result.
      </p>

      {Object.entries(overrides).map(([name, override]) => {
        const token = DEFAULT_SEMANTICS[name]
        if (!token || !('palette' in override)) return null
        const palettes = palettePool(token, customPalettes)
        return (
          <div key={name} className="flex flex-col gap-1">
            <span className="pl-1 text-[10px] tracking-widest text-fg-muted uppercase">
              {name.replace(/^color-/, '')}
            </span>
            <div className="flex items-center gap-2">
              <Select
                aria-label={`${name} palette`}
                className="flex-1"
                selectedKey={override.palette}
                onSelectionChange={(key) =>
                  setColorTokenOverride(name, {
                    ...override,
                    palette: String(key),
                  })
                }
              >
                <Button size="sm" className="w-full justify-between">
                  <SelectValue className="truncate" />
                  <ChevronDownIcon data-icon-end="" />
                </Button>
                <Popover>
                  <ListBox>
                    {palettes.map((palette) => (
                      <ListBoxItem key={palette} id={palette}>
                        {palette}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>
              <Select
                aria-label={`${name} job`}
                className="flex-1"
                selectedKey={override.job}
                onSelectionChange={(key) =>
                  setColorTokenOverride(name, {
                    ...override,
                    job: key as JobName,
                  })
                }
              >
                <Button size="sm" className="w-full justify-between">
                  <SelectValue className="truncate" />
                  <ChevronDownIcon data-icon-end="" />
                </Button>
                <Popover>
                  <ListBox>
                    {JOB_NAMES.map((job) => (
                      <ListBoxItem key={job} id={job}>
                        {job}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>
              <Button
                size="sm"
                variant="quiet"
                aria-label={`Reset ${name}`}
                onPress={() => setColorTokenOverride(name, undefined)}
              >
                <XIcon />
              </Button>
            </div>
          </div>
        )
      })}

      {available.length > 0 && (
        <Select
          aria-label="Add token override"
          className="w-full"
          selectedKey={null}
          onSelectionChange={(key) => {
            const entry = REMAPPABLE.find(([name]) => name === key)
            if (!entry) return
            const spec = defaultSpec(entry[1], customPalettes)
            if (spec) setColorTokenOverride(entry[0], spec)
          }}
        >
          <Label>Add override</Label>
          <Button size="sm" className="w-full justify-between">
            <SelectValue className="truncate">
              {() => 'Pick a token…'}
            </SelectValue>
            <ChevronDownIcon data-icon-end="" />
          </Button>
          <Popover>
            <ListBox>
              {available.map(([name]) => (
                <ListBoxItem key={name} id={name}>
                  {name.replace(/^color-/, '')}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      )}
    </div>
  )
}
