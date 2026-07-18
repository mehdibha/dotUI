import { useState, type ReactNode } from 'react'

import type { CvdType } from '../color'
import {
  referenceSystems,
  resolveRoles,
  scaleByRole,
  UI_ROLES,
  type ScaleRole,
  type Step,
} from '../data'
import type { Mode } from '../page'
import { ScaleStrip, stepHex } from '../primitives'

/** Side-by-side ramps. Two projections of the same data: equal-width chips
    (how the scale is used) and true-lightness positioning (how the scale is
    actually spaced — chips sit at their measured OKLCH lightness). */
export function RampsSection({
  mode,
  cvd,
  family,
}: {
  mode: Mode
  cvd: CvdType | null
  family: ScaleRole
}) {
  const [spacing, setSpacing] = useState<'equal' | 'true' | 'roles'>('equal')
  const [hoverFrac, setHoverFrac] = useState<number | null>(null)

  const rows = referenceSystems.map((system) => {
    const scale = scaleByRole(system, family)
    const steps = scale
      ? mode === 'dark' && scale.dark
        ? scale.dark
        : scale.light
      : []
    return { system, scale, steps }
  })

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 text-xs">
        {(
          [
            ['equal', 'Equal spacing'],
            ['true', 'True lightness'],
            ['roles', 'By role'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSpacing(id)}
            className={`rounded-md px-2 py-1 ${
              spacing === id
                ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
            }`}
          >
            {label}
          </button>
        ))}
        {spacing === 'true' && (
          <span className="ml-3 text-[11px] text-neutral-400 dark:text-neutral-500">
            x-position = OKLCH lightness · overlapping chips mean bunched steps
          </span>
        )}
        {spacing === 'roles' && (
          <span className="ml-3 text-[11px] text-neutral-400 dark:text-neutral-500">
            each system's documented mapping onto the 12 shared UI roles —
            hatched cells are roles the system doesn't define
          </span>
        )}
      </div>

      {spacing === 'roles' && (
        <div className="mb-1 grid grid-cols-[11rem_1fr] gap-4">
          <div />
          <div className="flex">
            {UI_ROLES.map((role) => (
              <span
                key={role}
                className="min-w-0 flex-1 truncate pr-1 font-mono text-[8px] text-neutral-400 uppercase dark:text-neutral-500"
              >
                {role.replace(/([A-Z])/g, ' $1')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <RampRow label="dotUI Engine" sub="awaiting rewrite" engine>
          {spacing === 'roles' ? (
            <div className="flex h-10 gap-px">
              {UI_ROLES.map((role) => (
                <div
                  key={role}
                  className="min-w-0 flex-1 rounded-sm border border-dashed border-neutral-300 dark:border-neutral-700"
                />
              ))}
            </div>
          ) : (
            <div className="flex h-10 w-full items-center justify-center rounded-md border border-dashed border-neutral-300 text-[11px] text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
              engine output renders here
            </div>
          )}
        </RampRow>
        {rows.map(({ system, scale, steps }) => {
          const active =
            hoverFrac === null || steps.length === 0
              ? null
              : Math.round(hoverFrac * (steps.length - 1))
          const activeStep = active === null ? undefined : steps[active]
          return (
            <RampRow
              key={system.id}
              label={system.name}
              sub={
                activeStep
                  ? `${scale?.name ?? ''} ${activeStep.name} · ${activeStep.hex} · L ${activeStep.oklch.l.toFixed(3)}`
                  : (scale?.name ?? '—')
              }
              singlePalette={
                mode === 'dark' && scale !== undefined && scale.dark === null
              }
            >
              {steps.length === 0 ? (
                <div className="flex h-10 items-center text-xs text-neutral-400">
                  no {family} scale
                </div>
              ) : spacing === 'equal' ? (
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoverFrac(
                      Math.min(
                        1,
                        Math.max(0, (e.clientX - rect.left) / rect.width),
                      ),
                    )
                  }}
                  onMouseLeave={() => setHoverFrac(null)}
                >
                  <ScaleStrip steps={steps} cvd={cvd} active={active} />
                </div>
              ) : spacing === 'true' ? (
                <TrueLightnessRow steps={steps} cvd={cvd} active={active} />
              ) : scale ? (
                <RoleRail system={system} scale={scale} mode={mode} cvd={cvd} />
              ) : null}
            </RampRow>
          )
        })}
      </div>
    </div>
  )
}

function RampRow({
  label,
  sub,
  engine,
  singlePalette,
  children,
}: {
  label: string
  sub: string
  engine?: boolean
  singlePalette?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[11rem_1fr] items-center gap-4">
      <div className="min-w-0">
        <p
          className={`truncate text-[13px] font-medium ${engine ? 'text-neutral-400 dark:text-neutral-500' : ''}`}
        >
          {label}
          {singlePalette && (
            <span
              className="ml-1.5 font-mono text-[9px] text-neutral-400 uppercase dark:text-neutral-500"
              title="This system ships a single palette; dark mode reuses it."
            >
              single
            </span>
          )}
        </p>
        <p className="truncate font-mono text-[10px] text-neutral-400 tabular-nums dark:text-neutral-500">
          {sub}
        </p>
      </div>
      {children}
    </div>
  )
}

function RoleRail({
  system,
  scale,
  mode,
  cvd,
}: {
  system: (typeof referenceSystems)[number]
  scale: NonNullable<ReturnType<typeof scaleByRole>>
  mode: Mode
  cvd: CvdType | null
}) {
  const roles = resolveRoles(system, scale, mode)
  return (
    <div className="flex h-10 gap-px">
      {UI_ROLES.map((role) => {
        const step = roles[role]
        if (!step)
          return (
            <div
              key={role}
              title={`${role} — not defined by ${system.name}`}
              className="min-w-0 flex-1 rounded-sm bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(128,128,128,0.25)_3px,rgba(128,128,128,0.25)_4px)]"
            />
          )
        return (
          <button
            key={role}
            type="button"
            title={`${role} → step ${step.name} · ${step.hex}`}
            onClick={() => navigator.clipboard?.writeText(step.raw)}
            style={{ backgroundColor: stepHex(step, cvd) }}
            className="min-w-0 flex-1 rounded-sm"
          />
        )
      })}
    </div>
  )
}

function TrueLightnessRow({
  steps,
  cvd,
  active,
}: {
  steps: Step[]
  cvd: CvdType | null
  active: number | null
}) {
  return (
    <div className="relative h-10">
      <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-100 dark:bg-neutral-900" />
      {steps.map((step, index) => (
        <div
          key={index}
          title={`${step.name} · L ${step.oklch.l.toFixed(3)}`}
          style={{
            left: `${step.oklch.l * 100}%`,
            backgroundColor: stepHex(step, cvd),
          }}
          className={`absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white transition-transform dark:ring-neutral-950 ${
            active === index ? 'z-10 scale-150' : ''
          }`}
        />
      ))}
    </div>
  )
}
