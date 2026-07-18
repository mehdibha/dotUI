import { Fragment, useState } from 'react'

import { apcaContrast, wcagContrast } from '../color'
import {
  mappingFor,
  referenceSystems,
  scaleByRole,
  type ColorSystem,
  type ScaleRole,
  type Step,
} from '../data'
import type { Mode } from '../page'

function stepsFor(system: ColorSystem, family: ScaleRole, mode: Mode): Step[] {
  const scale = scaleByRole(system, family)
  if (!scale) return []
  return mode === 'dark' && scale.dark ? scale.dark : scale.light
}

/** Contrast, two ways: a promises table (each system's documented text/solid
    roles, measured) and the Aa matrix (every text-on-bg pair, rendered — you
    read the contrast instead of inferring it). */
export function ContrastSection({
  mode,
  family,
}: {
  mode: Mode
  family: ScaleRole
}) {
  const [selected, setSelected] = useState(referenceSystems[0]?.id ?? '')
  const selectedSystem = referenceSystems.find((s) => s.id === selected)

  return (
    <div className="space-y-10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-130 text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-[11px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
              <th className="py-2 pr-4 font-normal">System</th>
              <th className="py-2 pr-4 font-normal">
                Text on app bg
                <Sub>WCAG · APCA</Sub>
              </th>
              <th className="py-2 pr-4 font-normal">
                Subtle text on app bg
                <Sub>WCAG · APCA</Sub>
              </th>
              <th className="py-2 pr-4 font-normal">
                Solid vs its foreground
                <Sub>WCAG</Sub>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100 text-neutral-400 dark:border-neutral-900 dark:text-neutral-500">
              <td className="py-2.5 pr-4 font-medium">dotUI Engine</td>
              <td className="py-2.5 pr-4">—</td>
              <td className="py-2.5 pr-4">—</td>
              <td className="py-2.5 pr-4">—</td>
            </tr>
            {referenceSystems.map((system) => (
              <PromiseRow
                key={system.id}
                system={system}
                family={family}
                mode={mode}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="mr-1 text-neutral-400 dark:text-neutral-500">
            Aa matrix — every step as text on every step as background:
          </span>
          {referenceSystems.map((system) => (
            <button
              key={system.id}
              type="button"
              onClick={() => setSelected(system.id)}
              className={`rounded-md px-2 py-1 ${
                selected === system.id
                  ? 'bg-neutral-100 font-medium dark:bg-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
              }`}
            >
              {system.name}
            </button>
          ))}
        </div>
        {selectedSystem && (
          <AaMatrix steps={stepsFor(selectedSystem, family, mode)} />
        )}
        <p className="mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          Ring = APCA |Lc| ≥ 60 (readable body text). Hover a cell for exact
          values. Rows are the text step, columns the background step.
        </p>
      </div>
    </div>
  )
}

function Sub({ children }: { children: string }) {
  return (
    <span className="ml-1.5 font-mono text-[9px] uppercase">{children}</span>
  )
}

function PromiseRow({
  system,
  family,
  mode,
}: {
  system: ColorSystem
  family: ScaleRole
  mode: Mode
}) {
  const scale = scaleByRole(system, family)
  const steps = stepsFor(system, family, mode)
  const at = (role: 'text' | 'textSubtle' | 'solid') => {
    const index = scale ? mappingFor(system, scale)[role] : undefined
    return index === null || index === undefined ? undefined : steps[index]
  }
  const text = at('text')
  const subtle = at('textSubtle')
  const solid = at('solid')
  return (
    <tr className="border-b border-neutral-100 dark:border-neutral-900">
      <td className="py-2.5 pr-4 font-medium">{system.name}</td>
      <PairCell wcag={text?.vsBg.wcag} apca={text?.vsBg.apca} wcagPass={7} />
      <PairCell
        wcag={subtle?.vsBg.wcag}
        apca={subtle?.vsBg.apca}
        wcagPass={4.5}
      />
      <td className="py-2.5 pr-4">
        {solid ? (
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <span
              className="inline-flex size-4 items-center justify-center rounded-[4px] text-[8px] font-bold"
              style={{
                backgroundColor: solid.hex,
                color: solid.asBg.fg === 'white' ? '#fff' : '#111',
              }}
            >
              A
            </span>
            {solid.asBg.wcag.toFixed(2)}
            <Pass ok={solid.asBg.wcag >= 4.5} />
          </span>
        ) : (
          '—'
        )}
      </td>
    </tr>
  )
}

function PairCell({
  wcag,
  apca,
  wcagPass,
}: {
  wcag: number | undefined
  apca: number | undefined
  wcagPass: number
}) {
  if (wcag === undefined || apca === undefined)
    return <td className="py-2.5 pr-4 text-neutral-400">—</td>
  return (
    <td className="py-2.5 pr-4 tabular-nums">
      <span className="inline-flex items-center gap-1.5">
        {wcag.toFixed(2)}
        <span className="text-neutral-400 dark:text-neutral-500">
          Lc {Math.abs(apca).toFixed(0)}
        </span>
        <Pass ok={wcag >= wcagPass} />
      </span>
    </td>
  )
}

function Pass({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block size-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-red-400'}`}
      title={ok ? 'passes' : 'fails'}
    />
  )
}

function AaMatrix({ steps }: { steps: Step[] }) {
  const [hover, setHover] = useState<{ t: number; b: number } | null>(null)
  if (steps.length === 0) return null
  const hoverText = hover && steps[hover.t]
  const hoverBg = hover && steps[hover.b]
  return (
    <div className="overflow-x-auto">
      <div
        className="grid w-max gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800"
        style={{
          gridTemplateColumns: `2.5rem repeat(${steps.length}, 2.5rem)`,
        }}
        onMouseLeave={() => setHover(null)}
      >
        <div className="bg-white dark:bg-neutral-950" />
        {steps.map((bg, b) => (
          <div
            key={b}
            className="flex h-6 items-center justify-center bg-white font-mono text-[9px] text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500"
          >
            {bg.name}
          </div>
        ))}
        {steps.map((text, t) => (
          <Fragment key={t}>
            <div className="flex items-center justify-center bg-white font-mono text-[9px] text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500">
              {text.name}
            </div>
            {steps.map((bg, b) => {
              const lc = apcaContrast(text.rgb, bg.rgb)
              const readable = Math.abs(lc) >= 60
              return (
                <button
                  key={`${t}-${b}`}
                  type="button"
                  onMouseEnter={() => setHover({ t, b })}
                  style={{ backgroundColor: bg.hex, color: text.hex }}
                  className={`flex h-9 items-center justify-center text-[11px] font-medium ${
                    readable ? 'inset-ring-2 inset-ring-white/40' : ''
                  }`}
                >
                  Aa
                </button>
              )
            })}
          </Fragment>
        ))}
      </div>
      <p className="mt-1.5 h-4 font-mono text-[10px] text-neutral-500 tabular-nums dark:text-neutral-400">
        {hoverText && hoverBg
          ? `text ${hoverText.name} on bg ${hoverBg.name} · WCAG ${wcagContrast(hoverText.rgb, hoverBg.rgb).toFixed(2)} · APCA Lc ${apcaContrast(hoverText.rgb, hoverBg.rgb).toFixed(1)}`
          : ''}
      </p>
    </div>
  )
}
