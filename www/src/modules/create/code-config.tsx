import type { ReactNode } from 'react'

import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Slider, SliderControl } from '@/registry/ui/slider'
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

function SliderRow({
  label,
  value,
  minValue,
  maxValue,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  minValue: number
  maxValue: number
  step: number
  format?: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs font-medium text-fg tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <Slider
        aria-label={label}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        onChange={(v) => {
          const next = Array.isArray(v) ? v[0] : v
          if (typeof next === 'number') onChange(next)
        }}
      >
        <SliderControl />
      </Slider>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] tracking-widest text-fg-muted uppercase">
        {title}
      </span>
      {children}
    </div>
  )
}

/* -------------------------------- config -------------------------------- */

export function CodeConfig() {
  const { designSystem, setCodeOption } = useDesignSystem()
  const opts = designSystem.codeOptions ?? DEFAULT_CODE_OPTIONS

  return (
    <div className="flex flex-col gap-6">
      <Section title="Formatting">
        <EnumRow
          label="Quotes"
          value={opts.quoteStyle}
          options={[
            { value: 'double', label: 'Double' },
            { value: 'single', label: 'Single' },
          ]}
          onChange={(v) => setCodeOption('quoteStyle', v)}
        />
        <EnumRow
          label="JSX quotes"
          value={opts.jsxQuoteStyle}
          options={[
            { value: 'double', label: 'Double' },
            { value: 'single', label: 'Single' },
          ]}
          onChange={(v) => setCodeOption('jsxQuoteStyle', v)}
        />
        <SwitchRow
          label="Semicolons"
          value={opts.semicolons}
          onChange={(v) => setCodeOption('semicolons', v)}
        />
        <EnumRow
          label="Indentation"
          value={opts.indentStyle}
          options={[
            { value: 'space', label: 'Spaces' },
            { value: 'tab', label: 'Tabs' },
          ]}
          onChange={(v) => setCodeOption('indentStyle', v)}
        />
        <SliderRow
          label="Indent width"
          value={opts.indentWidth}
          minValue={1}
          maxValue={8}
          step={1}
          onChange={(v) => setCodeOption('indentWidth', v)}
        />
        <SliderRow
          label="Print width"
          value={opts.printWidth}
          minValue={40}
          maxValue={160}
          step={10}
          onChange={(v) => setCodeOption('printWidth', v)}
        />
        <EnumRow
          label="Trailing commas"
          value={opts.trailingComma}
          options={[
            { value: 'all', label: 'All' },
            { value: 'es5', label: 'ES5' },
            { value: 'none', label: 'None' },
          ]}
          onChange={(v) => setCodeOption('trailingComma', v)}
        />
        <EnumRow
          label="Arrow parens"
          description="(x) => x or x => x"
          value={opts.arrowParens}
          options={[
            { value: 'always', label: 'Always' },
            { value: 'avoid', label: 'Avoid' },
          ]}
          onChange={(v) => setCodeOption('arrowParens', v)}
        />
        <SwitchRow
          label="Bracket spacing"
          description="{ foo } or {foo}"
          value={opts.bracketSpacing}
          onChange={(v) => setCodeOption('bracketSpacing', v)}
        />
        <EnumRow
          label="Object keys"
          value={opts.quoteProps}
          options={[
            { value: 'as-needed', label: 'As needed' },
            { value: 'consistent', label: 'Consistent' },
            { value: 'preserve', label: 'Preserve' },
          ]}
          onChange={(v) => setCodeOption('quoteProps', v)}
        />
        <EnumRow
          label="End of line"
          value={opts.endOfLine}
          options={[
            { value: 'lf', label: 'LF' },
            { value: 'crlf', label: 'CRLF' },
          ]}
          onChange={(v) => setCodeOption('endOfLine', v)}
        />
      </Section>

      <Section title="JSX">
        <SwitchRow
          label="Closing bracket same line"
          value={opts.jsxBracketSameLine}
          onChange={(v) => setCodeOption('jsxBracketSameLine', v)}
        />
        <SwitchRow
          label="One attribute per line"
          value={opts.singleAttributePerLine}
          onChange={(v) => setCodeOption('singleAttributePerLine', v)}
        />
      </Section>

      <Section title="Imports & classes">
        <SwitchRow
          label="Sort imports"
          value={opts.sortImports}
          onChange={(v) => setCodeOption('sortImports', v)}
        />
        <SwitchRow
          label="Sort Tailwind classes"
          value={opts.sortClasses}
          onChange={(v) => setCodeOption('sortClasses', v)}
        />
        <EnumRow
          label="Class values"
          description="tv() base/slot class lists"
          value={opts.classArrays ? 'arrays' : 'string'}
          options={[
            { value: 'arrays', label: 'Arrays' },
            { value: 'string', label: 'String' },
          ]}
          onChange={(v) => setCodeOption('classArrays', v === 'arrays')}
        />
      </Section>

      <Section title="Directives & comments">
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
      </Section>
    </div>
  )
}

/* -------------------------------- summary -------------------------------- */

export function CodeSummary() {
  const { designSystem } = useDesignSystem()
  const opts = designSystem.codeOptions ?? DEFAULT_CODE_OPTIONS

  const facts = [
    opts.quoteStyle === 'single' ? 'Single quotes' : 'Double quotes',
    opts.indentStyle === 'tab' ? 'Tabs' : `${opts.indentWidth} spaces`,
    opts.semicolons ? 'Semicolons' : 'No semicolons',
  ]

  return (
    <div className="-mt-1 flex flex-col items-start gap-1">
      <p className="font-medium">TypeScript</p>
      <p className="text-xs text-fg-muted">{facts.join(' · ')}</p>
    </div>
  )
}
