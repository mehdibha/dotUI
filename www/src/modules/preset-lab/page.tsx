'use client'

import { useEffect, useState, type ReactNode } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import type { DesignSystem } from '@/modules/create/preset'
import { PRESETS } from '@/modules/presets/presets-data'

import { claudeAudit } from './data/claude'
import { linearAudit } from './data/linear'
import { stripeAudit } from './data/stripe'
import { supabaseAudit } from './data/supabase'
import { vercelAudit } from './data/vercel'
import { componentRenders, renderCaptions } from './renders'
import {
  MAX_SCORE,
  passes,
  RUBRIC_CRITERIA,
  totalScore,
  type AuditEntry,
} from './rubric'

type System = {
  id: string
  name: string
  designSystem: DesignSystem
  audit: AuditEntry[]
}

function presetSystem(
  id: string,
  name: string,
  audit: AuditEntry[],
): System | null {
  const preset = PRESETS.find((p) => p.id === id)
  return preset ? { id, name, designSystem: preset.designSystem, audit } : null
}

const SYSTEMS: System[] = [
  presetSystem('vercel', 'Vercel', vercelAudit),
  presetSystem('linear', 'Linear', linearAudit),
  presetSystem('supabase', 'Supabase', supabaseAudit),
  presetSystem('stripe', 'Stripe', stripeAudit),
  presetSystem('claude', 'Claude', claudeAudit),
].filter((s): s is System => s !== null)

// refs/<system>/<component>-<light|dark>.png
const refImages = import.meta.glob('./refs/*/**.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function refUrl(
  system: string,
  component: string,
  mode: 'light' | 'dark',
): string | undefined {
  return refImages[`./refs/${system}/${component}-${mode}.png`]
}

export function PresetLab() {
  const [systemId, setSystemId] = useState(
    () =>
      new URLSearchParams(globalThis.location?.search).get('system') ??
      'vercel',
  )
  const [mounted, setMounted] = useState(false)

  // Scoped theming is client-only (it mirrors the live `:root` closure); render
  // the live cells only after mount so they theme correctly.
  useEffect(() => setMounted(true), [])

  const system = SYSTEMS.find((s) => s.id === systemId) ?? SYSTEMS[0]
  if (!system) return null

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
          internal / preset-lab
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Preset Lab
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Every audited component rendered live under a preset, side by side
          with a reference capture of the real system, scored against the
          fidelity rubric.
        </p>
      </header>

      <nav className="sticky top-0 z-40 border-y border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-2.5">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Preset
          </span>
          <ToggleButtonGroup
            aria-label="Preset"
            size="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[systemId]}
            onSelectionChange={(keys) => {
              const key = [...keys][0]
              if (key) setSystemId(key as string)
            }}
          >
            {SYSTEMS.map((s) => (
              <ToggleButton key={s.id} id={s.id}>
                {s.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-16 px-6 py-16">
        <CoverageMatrix system={system} />

        <div className="space-y-20">
          {system.audit.map((entry) => (
            <ComponentSection
              key={entry.component}
              system={system}
              entry={entry}
              mounted={mounted}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function CoverageMatrix({ system }: { system: System }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold tracking-tight">
        Coverage matrix
      </h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Component</th>
              <th className="px-4 py-2.5 font-medium">Score</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {system.audit.map((entry) => {
              const scores = entry.scores
              const total = scores ? totalScore(scores) : null
              const status = !scores
                ? 'unscored'
                : passes(scores)
                  ? 'pass'
                  : 'fail'
              return (
                <tr
                  key={entry.component}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-900"
                >
                  <td className="px-4 py-2.5 font-medium capitalize">
                    {entry.component}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-neutral-500 tabular-nums dark:text-neutral-400">
                    {total === null ? '—' : `${total} / ${MAX_SCORE}`}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusPill({ status }: { status: 'pass' | 'fail' | 'unscored' }) {
  const styles = {
    pass: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    fail: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    unscored:
      'bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400',
  }[status]
  const label = { pass: 'Pass', fail: 'Fail', unscored: 'Unscored' }[status]
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  )
}

function ComponentSection({
  system,
  entry,
  mounted,
}: {
  system: System
  entry: AuditEntry
  mounted: boolean
}) {
  const caption = renderCaptions[entry.component]
  return (
    <section className="scroll-mt-20">
      <div className="mb-4 flex items-baseline gap-3">
        <h2 className="text-xl font-semibold tracking-tight capitalize">
          {entry.component}
        </h2>
        {caption && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {caption}
          </span>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel label="Ours">
          <div className="grid gap-4 sm:grid-cols-2">
            <OurCell
              system={system}
              entry={entry}
              mode="light"
              mounted={mounted}
            />
            <OurCell
              system={system}
              entry={entry}
              mode="dark"
              mounted={mounted}
            />
          </div>
        </Panel>
        <Panel label="Reference">
          <div className="grid gap-4 sm:grid-cols-2">
            <RefCell
              system={system.id}
              component={entry.component}
              mode="light"
            />
            <RefCell
              system={system.id}
              component={entry.component}
              mode="dark"
            />
          </div>
        </Panel>
      </div>

      <RubricRow entry={entry} />
      {entry.notes && (
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {entry.notes}
        </p>
      )}
    </section>
  )
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
        {label}
      </p>
      {children}
    </div>
  )
}

function ModeTag({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <p className="mb-1.5 text-[11px] text-neutral-400 capitalize dark:text-neutral-600">
      {mode}
    </p>
  )
}

function OurCell({
  system,
  entry,
  mode,
  mounted,
}: {
  system: System
  entry: AuditEntry
  mode: 'light' | 'dark'
  mounted: boolean
}) {
  const render = componentRenders[entry.component]
  return (
    <div>
      <ModeTag mode={mode} />
      <div className="min-h-24 rounded-lg border border-neutral-200 dark:border-neutral-800">
        {mounted ? (
          <DesignSystemProvider
            scoped
            forcedMode={mode}
            params={system.designSystem.componentParams}
            tokens={system.designSystem.tokens}
            density={system.designSystem.density}
            color={system.designSystem.color}
            icons={system.designSystem.icons}
          >
            <div className="rounded-lg bg-bg p-6 text-fg">
              {render ? (
                render()
              ) : (
                <Placeholder>Needs an interactive audit</Placeholder>
              )}
            </div>
          </DesignSystemProvider>
        ) : (
          <Placeholder>Loading…</Placeholder>
        )}
      </div>
    </div>
  )
}

function RefCell({
  system,
  component,
  mode,
}: {
  system: string
  component: string
  mode: 'light' | 'dark'
}) {
  const url = refUrl(system, component, mode)
  return (
    <div>
      <ModeTag mode={mode} />
      <div className="min-h-24 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        {url ? (
          <img
            src={url}
            alt={`${system} ${component} reference (${mode})`}
            className="w-full"
          />
        ) : (
          <Placeholder>
            Reference missing — expected refs/{system}/{component}-{mode}.png
          </Placeholder>
        )}
      </div>
    </div>
  )
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-24 items-center justify-center p-6 text-center text-xs text-neutral-400 dark:text-neutral-600">
      {children}
    </div>
  )
}

function RubricRow({ entry }: { entry: AuditEntry }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {RUBRIC_CRITERIA.map((c) => {
        const score = entry.scores ? entry.scores[c.id] : null
        return (
          <div
            key={c.id}
            title={c.hint}
            className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 dark:border-neutral-800"
          >
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {c.label}
            </span>
            <span className="font-mono text-xs text-neutral-900 tabular-nums dark:text-neutral-100">
              {score === null ? '—' : `${score}/2`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
