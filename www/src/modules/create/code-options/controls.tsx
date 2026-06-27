import type { ReactNode } from 'react'

import { Switch } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'

import { useDesignSystem } from '../preset'

/* ------------------------------ row helpers ------------------------------ */

function Row({
  label,
  description,
  control,
}: {
  label: string
  description?: string
  control: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm">{label}</span>
        {description ? (
          <span className="text-xs text-fg-muted">{description}</span>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

function SwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Row
      label={label}
      description={description}
      control={
        <Switch
          size="sm"
          isSelected={value}
          onChange={onChange}
          aria-label={label}
        />
      }
    />
  )
}

function EnumRow<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string
  description?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <Row
      label={label}
      description={description}
      control={
        <ToggleButtonGroup
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[value]}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next != null) onChange(next as T)
          }}
          aria-label={label}
        >
          {options.map((opt) => (
            <ToggleButton key={opt.value} id={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }
    />
  )
}

/* -------------------------------- controls ------------------------------- */

/**
 * Controls for the non-formatter `codeOptions` axes. Pure formatting (quotes,
 * semicolons, indentation, sorting…) is the consumer's Prettier/Biome job, and
 * the `"use client"` directive is handled by the shadcn CLI — so we only expose
 * what survives a formatter pass and isn't already managed elsewhere.
 */
export function CodeOptionsControls() {
  const { designSystem, setCodeOption } = useDesignSystem()
  const opts = designSystem.codeOptions ?? DEFAULT_CODE_OPTIONS

  return (
    <div className="flex flex-col gap-5">
      <EnumRow
        label="Class lists"
        description="tv() base & slot classes"
        value={opts.classArrays ? 'arrays' : 'string'}
        options={[
          { value: 'arrays', label: 'Arrays' },
          { value: 'string', label: 'String' },
        ]}
        onChange={(v) => setCodeOption('classArrays', v === 'arrays')}
      />
      <SwitchRow
        label="Section separators"
        description="Divide the file with comment rules"
        value={opts.sectionComments}
        onChange={(v) => setCodeOption('sectionComments', v)}
      />
    </div>
  )
}
