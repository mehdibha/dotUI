import type { ReactNode } from 'react'

import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Switch } from '@/registry/ui/switch'
import { TextField } from '@/registry/ui/text-field'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'

import { useDesignSystem } from './preset'

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

/* -------------------------------- config -------------------------------- */

/**
 * Controls for the non-formatter `codeOptions` axes. Pure formatting
 * (quotes, semicolons, indentation, sorting…) is intentionally absent — the
 * consumer reformats with their own Prettier/Biome rules, so we only expose
 * choices that survive that pass.
 */
export function CodeConfig() {
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
      <EnumRow
        label='"use client"'
        description="Keep for RSC, strip for SPA/Vite"
        value={opts.useClient}
        options={[
          { value: 'keep', label: 'Keep' },
          { value: 'strip', label: 'Strip' },
        ]}
        onChange={(v) => setCodeOption('useClient', v)}
      />
      <SwitchRow
        label="Section comments"
        description="Keep // MARK: dividers"
        value={opts.sectionComments}
        onChange={(v) => setCodeOption('sectionComments', v)}
      />
      <div className="flex flex-col gap-2">
        <Label>File header</Label>
        <TextField
          aria-label="File header"
          value={opts.fileHeader}
          onChange={(v) => setCodeOption('fileHeader', v)}
        >
          <TextArea
            rows={3}
            placeholder="© 2026 Acme — licensed under MIT"
            className="font-mono text-xs"
          />
        </TextField>
        <span className="text-xs text-fg-muted">
          Prepended to every file as a comment block.
        </span>
      </div>
    </div>
  )
}
