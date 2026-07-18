/* The in-context stress test: a small product UI rendered ONLY from a system's
   documented role mapping, so every system — and later the dotUI engine — is
   judged on identical mechanics. No registry components on purpose: the lab
   must not inherit dotUI's own styling opinions. */

import type { CSSProperties } from 'react'

import { rgbToHex, simulateCvd, type CvdType } from './color'
import {
  resolveRoles,
  scaleByRole,
  type ColorSystem,
  type Step,
  type UiRole,
} from './data'

type Mode = 'light' | 'dark'
type Roles = Partial<Record<UiRole, Step>>

function color(
  roles: Roles,
  cvd: CvdType | null,
  ...chain: [UiRole, ...UiRole[]]
): string {
  for (const role of chain) {
    const step = roles[role]
    if (!step) continue
    if (!cvd) return step.hex
    return rgbToHex(simulateCvd(step.rgb, cvd))
  }
  return 'transparent'
}

export function systemPreviewVars(
  system: ColorSystem,
  mode: Mode,
  cvd: CvdType | null,
): Record<string, string> {
  const vars: Record<string, string> = {}
  const families = [
    'neutral',
    'accent',
    'danger',
    'success',
    'warning',
  ] as const
  // Systems with no documented app-bg step (Tailwind) assume a plain canvas.
  const canvas = mode === 'light' ? '#ffffff' : '#0a0a0a'
  for (const family of families) {
    const scale = scaleByRole(system, family)
    if (!scale) continue
    const roles = resolveRoles(system, scale, mode)
    const c = (...chain: [UiRole, ...UiRole[]]) => color(roles, cvd, ...chain)
    const p = `--${family}`
    const appBg = c('appBg', 'subtleBg')
    vars[`${p}-app-bg`] = appBg === 'transparent' ? canvas : appBg
    vars[`${p}-subtle-bg`] = c('subtleBg', 'uiBg', 'appBg')
    vars[`${p}-ui-bg`] = c('uiBg', 'subtleBg')
    vars[`${p}-ui-bg-hover`] = c('uiBgHover', 'uiBg')
    vars[`${p}-ui-bg-active`] = c('uiBgActive', 'uiBgHover', 'uiBg')
    vars[`${p}-border-subtle`] = c('borderSubtle', 'border')
    vars[`${p}-border`] = c('border', 'borderSubtle')
    vars[`${p}-border-strong`] = c('borderStrong', 'border')
    vars[`${p}-solid`] = c('solid')
    vars[`${p}-solid-hover`] = c('solidHover', 'solid')
    vars[`${p}-text-subtle`] = c('textSubtle', 'text')
    vars[`${p}-text`] = c('text')
    const solidStep = roles.solid ?? roles.solidHover
    vars[`${p}-solid-fg`] = solidStep
      ? solidFg(solidStep, system)
      : 'transparent'
  }
  return vars
}

function solidFg(step: Step, system: ColorSystem): string {
  if (/dark|black/i.test(system.solidForeground) && step.asBg.fg === 'black')
    return '#111111'
  return step.asBg.fg === 'black' ? '#111111' : '#ffffff'
}

export function SystemPreview({
  system,
  mode,
  cvd,
}: {
  system: ColorSystem
  mode: Mode
  cvd: CvdType | null
}) {
  if (system.empty) return <EmptyPreview />
  if (mode === 'dark' && system.scales.some((s) => s.dark === null))
    return (
      <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <p className="max-w-52 text-center text-xs text-neutral-400 dark:text-neutral-500">
          {system.name} ships no complete dark palette — nothing honest to
          render here.
        </p>
      </div>
    )
  const vars = systemPreviewVars(system, mode, cvd)
  return (
    <div
      style={vars as CSSProperties}
      className="overflow-hidden rounded-xl border border-(--neutral-border-subtle) bg-(--neutral-app-bg) text-left font-sans shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-(--neutral-border-subtle) px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-(--accent-solid)" />
          <span className="text-[13px] font-semibold text-(--neutral-text)">
            Acme
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-(--neutral-text-subtle)">
          <span className="rounded-md px-2 py-1">Docs</span>
          <span className="rounded-md bg-(--neutral-ui-bg) px-2 py-1 text-(--neutral-text)">
            Projects
          </span>
          <span className="rounded-md px-2 py-1">Settings</span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 rounded-lg border border-(--danger-border) bg-(--danger-subtle-bg) px-3 py-2">
          <svg
            viewBox="0 0 16 16"
            className="size-3.5 shrink-0 fill-(--danger-text)"
          >
            <path d="M8 1 15 14H1L8 1Zm-.75 5h1.5v4h-1.5V6ZM8 12.8a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
          </svg>
          <p className="text-xs text-(--danger-text)">
            Payment failed — the card on file was declined.
          </p>
        </div>
        <div className="rounded-lg border border-(--neutral-border) bg-(--neutral-subtle-bg) p-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-(--neutral-text)">
              Production deploy
            </p>
            <span className="rounded-full border border-(--success-border) bg-(--success-subtle-bg) px-2 py-0.5 text-[10px] font-medium text-(--success-text)">
              Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-(--neutral-text-subtle)">
            main · 2m 14s · triggered by push
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 flex-1 items-center rounded-md border border-(--neutral-border) bg-(--neutral-app-bg) px-2 outline-2 outline-offset-2 outline-(--accent-solid)">
              <span className="text-xs text-(--neutral-text-subtle)">
                acme.com/launch
              </span>
            </div>
            <button
              type="button"
              className="h-7 rounded-md bg-(--accent-solid) px-2.5 text-xs font-medium text-(--accent-solid-fg) hover:bg-(--accent-solid-hover)"
            >
              Deploy
            </button>
            <button
              type="button"
              className="h-7 rounded-md border border-(--neutral-border-strong) bg-(--neutral-ui-bg) px-2.5 text-xs font-medium text-(--neutral-text) hover:bg-(--neutral-ui-bg-hover) active:bg-(--neutral-ui-bg-active)"
            >
              Logs
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full border border-(--warning-border) bg-(--warning-subtle-bg) px-2 py-0.5 text-[10px] font-medium text-(--warning-text)">
              2 warnings
            </span>
            <span className="rounded-full border border-(--neutral-border) bg-(--neutral-ui-bg) px-2 py-0.5 text-[10px] font-medium text-(--neutral-text-subtle)">
              12 checks
            </span>
          </div>
          <span className="font-medium text-(--accent-text)">
            View activity →
          </span>
        </div>
      </div>
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
      <p className="max-w-48 text-center text-xs text-neutral-400 dark:text-neutral-500">
        The rewritten engine renders here, through the same 12 roles.
      </p>
    </div>
  )
}
