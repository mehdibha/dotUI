'use client'

import { useMemo, useState } from 'react'

import { measure } from '@/lib/color-math'
import { cn } from '@/lib/utils'
import type { Ramp } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { ListBoxItem } from '@/ui/list-box'
import { Select, SelectContent, SelectTrigger } from '@/ui/select'

import { ModeSwitcher } from './mode-switcher'

interface Guarantee {
  fgStep: string
  bgStep: string
  minLc: number
}

interface ContrastLabProps {
  ramps: Ramp[]
  modes: string[]
  /** Documented promises to sweep, e.g. Radix's step 11/12 on step 2 at Lc 60/90. */
  guarantees?: Guarantee[]
}

function stepValue(ramp: Ramp, step: string, mode: string) {
  return ramp.steps.find((s) => s.step === step)?.values[mode]
}

/** Re-measure a documented guarantee against every scale and mode it applies to. */
function GuaranteeSweep({
  ramps,
  modes,
  guarantees,
}: Required<ContrastLabProps>) {
  const rows = useMemo(
    () =>
      ramps.map((ramp) => ({
        ramp,
        cells: modes.flatMap((mode) =>
          guarantees.map((guarantee) => {
            const fg = stepValue(ramp, guarantee.fgStep, mode)
            const bg = stepValue(ramp, guarantee.bgStep, mode)
            const result = fg && bg ? measure(fg, bg) : null
            return {
              key: `${mode}-${guarantee.fgStep}`,
              mode,
              guarantee,
              fg,
              bg,
              lc: result ? Math.abs(result.apca) : null,
            }
          }),
        ),
      })),
    [ramps, modes, guarantees],
  )

  const total = rows.reduce(
    (n, row) => n + row.cells.filter((cell) => cell.lc !== null).length,
    0,
  )
  const failing = rows.flatMap((row) =>
    row.cells.filter(
      (cell) => cell.lc !== null && cell.lc < cell.guarantee.minLc,
    ),
  )

  return (
    <div>
      <p className="text-sm text-fg-muted">
        We re-measured the documented guarantee on every scale:{' '}
        <span className="font-medium text-fg">
          {total} pairs,{' '}
          {failing.length === 0 ? 'all pass' : `${failing.length} below target`}
        </span>
        .
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-fg-muted">
              <th className="px-3 py-2 font-medium">Scale</th>
              {modes.map((mode) =>
                guarantees.map((guarantee) => (
                  <th
                    key={`${mode}-${guarantee.fgStep}`}
                    className="px-3 py-2 text-right font-medium whitespace-nowrap"
                  >
                    {guarantee.fgStep} on {guarantee.bgStep} · {mode}
                    <span className="ml-1 font-normal">
                      (≥{guarantee.minLc})
                    </span>
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ ramp, cells }) => (
              <tr key={ramp.name} className="border-b last:border-b-0">
                <td className="px-3 py-1.5 font-mono text-xs">{ramp.name}</td>
                {cells.map((cell) => (
                  <td
                    key={cell.key}
                    className="px-3 py-1.5 text-right font-mono text-xs"
                  >
                    {cell.lc === null ? (
                      <span className="text-fg-muted">—</span>
                    ) : (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5',
                          cell.lc < cell.guarantee.minLc && 'text-fg-danger',
                        )}
                      >
                        <span
                          aria-hidden
                          className="inline-flex h-4 w-6 items-center justify-center rounded-xs border text-[9px]"
                          style={{ backgroundColor: cell.bg, color: cell.fg }}
                        >
                          Aa
                        </span>
                        {cell.lc.toFixed(1)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Free-play checker: any step on any step, any scale, live APCA + WCAG. */
function PairChecker({ ramps, modes }: { ramps: Ramp[]; modes: string[] }) {
  const [scaleName, setScaleName] = useState(
    () => ramps.find((r) => r.name === 'blue')?.name ?? ramps[0]?.name ?? '',
  )
  const [mode, setMode] = useState(modes[0] ?? 'light')
  const ramp = ramps.find((r) => r.name === scaleName)
  const steps = ramp?.steps.map((s) => s.step) ?? []
  const [fgStep, setFgStep] = useState('11')
  const [bgStep, setBgStep] = useState('2')

  const fg = ramp && stepValue(ramp, fgStep, mode)
  const bg = ramp && stepValue(ramp, bgStep, mode)
  const result = fg && bg ? measure(fg, bg) : null

  const stepSelect = (
    label: string,
    value: string,
    onChange: (step: string) => void,
  ) => (
    <label className="flex items-center gap-2 text-xs text-fg-muted">
      {label}
      <Select
        aria-label={label}
        selectedKey={steps.includes(value) ? value : steps[0]}
        onSelectionChange={(key) => onChange(String(key))}
        className="w-24"
      >
        <SelectTrigger size="sm" />
        <SelectContent>
          {steps.map((step) => (
            <ListBoxItem key={step} id={step} textValue={step}>
              {step}
            </ListBoxItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )

  return (
    <div className="rounded-lg border p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Scale"
          selectedKey={scaleName}
          onSelectionChange={(key) => setScaleName(String(key))}
          className="w-40"
        >
          <SelectTrigger size="sm" />
          <SelectContent items={ramps}>
            {(item) => (
              <ListBoxItem key={item.name} id={item.name} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </SelectContent>
        </Select>
        {stepSelect('text', fgStep, setFgStep)}
        {stepSelect('on', bgStep, setBgStep)}
        <ModeSwitcher modes={modes} mode={mode} onChange={setMode} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        <div
          className="flex h-24 w-full max-w-xs items-center justify-center rounded-md border px-4"
          style={{ backgroundColor: bg ?? undefined }}
        >
          <p className="text-lg font-medium" style={{ color: fg ?? undefined }}>
            The quick brown fox
          </p>
        </div>
        {result ? (
          <dl className="flex flex-col gap-1 font-mono text-sm">
            <div className="flex items-baseline gap-3">
              <dt className="w-14 text-xs text-fg-muted">APCA</dt>
              <dd>Lc {result.apca.toFixed(1)}</dd>
            </div>
            <div className="flex items-baseline gap-3">
              <dt className="w-14 text-xs text-fg-muted">WCAG 2</dt>
              <dd className="flex items-center gap-2">
                {result.wcag.toFixed(2)}:1
                <Badge
                  appearance="subtle"
                  variant={result.wcag >= 4.5 ? 'success' : 'neutral'}
                  size="sm"
                >
                  {result.wcag >= 7
                    ? 'AAA'
                    : result.wcag >= 4.5
                      ? 'AA'
                      : 'below AA'}
                </Badge>
              </dd>
            </div>
            <p className="mt-1 max-w-56 text-[10px] leading-relaxed text-fg-muted">
              measured from shipped values — {fg} on {bg}
            </p>
          </dl>
        ) : (
          <p className="text-sm text-fg-muted">
            This pair isn&apos;t statically resolvable.
          </p>
        )}
      </div>
    </div>
  )
}

export function ContrastLab({
  ramps,
  modes,
  guarantees = [],
}: ContrastLabProps) {
  const solid = ramps.filter(
    (ramp) => ramp.kind === 'chromatic' || ramp.kind === 'neutral',
  )
  if (solid.length === 0) return null
  return (
    <div className="flex flex-col gap-10">
      <section>
        <h3 className="text-sm font-medium">Check any pairing yourself</h3>
        <div className="mt-3">
          <PairChecker ramps={solid} modes={modes} />
        </div>
      </section>
      {guarantees.length > 0 && (
        <section>
          <h3 className="text-sm font-medium">The guarantee, swept</h3>
          <div className="mt-3">
            <GuaranteeSweep
              ramps={solid}
              modes={modes}
              guarantees={guarantees}
            />
          </div>
        </section>
      )}
    </div>
  )
}
