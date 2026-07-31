'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ruleY } from '@tanstack/charts'

import { Label } from '@/registry/ui/field'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch, SwitchControl } from '@/registry/ui/switch'

import { CodePane, SeatViewBar, type SeatView } from './code-view'
import {
  TANSTACK_PRIMITIVE_CODE,
  tanstackExampleCode,
  type CurveKind,
  type FocusMode,
  type MarkKind,
  type TooltipAnchor,
} from './codegen'
import { PanelRow, PanelSection, SlotSelect } from './controls'
import { desktopAverage, slotVar, visits, type ChartSlot } from './data'
import { AreaChart, BarChart, LineChart } from './primitive'

const monthTick = (value: unknown) => String(value).slice(0, 3)
const SERIES = ['desktop', 'mobile'] as const
const LABELS = { desktop: 'Desktop', mobile: 'Mobile' }

/* Palette slots are plain CSS variables, so recoloring is a repaint and never
   a scene rebuild. The extra level exists because a swap like 1↔2 would form
   a var() cycle if both were remapped on the same element. */
function PaletteScope({
  slots,
  children,
}: {
  slots: readonly ChartSlot[]
  children: ReactNode
}) {
  const source: Record<string, string> = {}
  const target: Record<string, string> = {}
  slots.forEach((slot, index) => {
    source[`--slot-${index + 1}`] = slotVar(slot)
    target[`--chart-${index + 1}`] = `var(--slot-${index + 1})`
  })
  return (
    <div style={source as CSSProperties}>
      <div style={target as CSSProperties}>{children}</div>
    </div>
  )
}

function OptionSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: readonly { id: T; label: string }[]
}) {
  return (
    <PanelRow label={label}>
      <Select
        aria-label={label}
        selectedKey={value}
        onSelectionChange={(key) => {
          if (typeof key === 'string') onChange(key as T)
        }}
        className="w-36"
      >
        <SelectTrigger size="sm" />
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} id={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PanelRow>
  )
}

function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Switch
      isSelected={value}
      onChange={onChange}
      className="flex min-h-8 w-full items-center justify-between gap-4"
    >
      <Label className="text-sm font-normal text-fg-muted">{label}</Label>
      <SwitchControl />
    </Switch>
  )
}

function SliderRow({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
}) {
  return (
    <PanelRow label={label}>
      <div className="flex items-center gap-3">
        <Slider
          aria-label={label}
          value={value}
          onChange={(next) => {
            onChange(Array.isArray(next) ? (next[0] ?? value) : next)
          }}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          className="w-32"
        >
          <SliderControl />
        </Slider>
        <span className="w-8 text-right font-mono text-xs text-fg-muted">
          {value}
        </span>
      </div>
    </PanelRow>
  )
}

/* The TanStack seat: the whole chart is one declarative definition, so every
   visual and behavioral decision can be a runtime knob — the builder thesis
   applied to charts. */
export function TanstackSeat() {
  const [desktopSlot, setDesktopSlot] = useState<ChartSlot>(1)
  const [mobileSlot, setMobileSlot] = useState<ChartSlot>(2)
  const [mark, setMark] = useState<MarkKind>('area')
  const [curve, setCurve] = useState<CurveKind>('natural')
  const [fillOpacity, setFillOpacity] = useState(20)
  const [strokeWidth, setStrokeWidth] = useState(2.25)
  const [points, setPoints] = useState(false)
  const [gradient, setGradient] = useState(false)
  const [barRadius, setBarRadius] = useState(4)
  const [grid, setGrid] = useState(true)
  const [axes, setAxes] = useState(true)
  const [refLine, setRefLine] = useState(false)
  const [legend, setLegend] = useState(true)
  const [focusMode, setFocusMode] = useState<FocusMode>('group-x')
  const [anchor, setAnchor] = useState<TooltipAnchor>('group-center')
  const [sticky, setSticky] = useState(true)
  const [animate, setAnimate] = useState(true)
  const [focused, setFocused] = useState<string | null>(null)
  const [view, setView] = useState<SeatView>('preview')

  /* Knobs map 1:1 to props on the component layer; the average line rides the
     `marks` escape hatch. Only genuine lists still need memoizing — every
     scalar and small object below is compared structurally. */
  const marks = useMemo(
    () =>
      refLine
        ? [
            ruleY([desktopAverage], {
              stroke: 'currentColor',
              strokeOpacity: 0.35,
              strokeWidth: 1,
              strokeDasharray: '4 3',
            }),
          ]
        : undefined,
    [refLine],
  )
  const common = {
    data: visits,
    x: 'month' as const,
    y: SERIES,
    labels: LABELS,
    formatX: monthTick,
    grid,
    axes,
    legend,
    focus: focusMode,
    tooltipAnchor: anchor,
    tooltipSticky: sticky,
    animate,
    marks,
    ariaLabel: 'Visitors by month, desktop and mobile',
  }

  return (
    <div className="flex h-full flex-col">
      <SeatViewBar view={view} onChange={setView} />
      {view === 'primitive' && (
        <CodePane title="ui/chart.tsx" code={TANSTACK_PRIMITIVE_CODE} />
      )}
      {view !== 'primitive' && (
        <>
          {view === 'example' ? (
            <CodePane
              title="visitors-chart.tsx"
              code={tanstackExampleCode({
                desktopSlot,
                mobileSlot,
                mark,
                curve,
                fillOpacity,
                strokeWidth,
                points,
                gradient,
                barRadius,
                grid,
                axes,
                refLine,
                legend,
                focusMode,
                anchor,
                sticky,
                animate,
              })}
            />
          ) : (
            <div className="p-4">
              <PaletteScope slots={[desktopSlot, mobileSlot]}>
                {mark === 'bar' && (
                  <BarChart
                    {...common}
                    radius={barRadius}
                    onFocusChange={(point) =>
                      setFocused(
                        point &&
                          `${point.datum.month} · ${point.groupLabel} · ${point.yValue}`,
                      )
                    }
                  />
                )}
                {mark === 'line' && (
                  <LineChart
                    {...common}
                    curve={curve}
                    strokeWidth={strokeWidth}
                    points={points}
                    onFocusChange={(point) =>
                      setFocused(
                        point &&
                          `${point.datum.month} · ${point.groupLabel} · ${point.yValue}`,
                      )
                    }
                  />
                )}
                {mark === 'area' && (
                  <AreaChart
                    {...common}
                    curve={curve}
                    strokeWidth={strokeWidth}
                    points={points}
                    fill={gradient ? 'gradient' : fillOpacity / 100}
                    onFocusChange={(point) =>
                      setFocused(
                        point &&
                          `${point.datum.month} · ${point.groupLabel} · ${point.yValue}`,
                      )
                    }
                  />
                )}
              </PaletteScope>
              <p className="mt-2 h-4 truncate font-mono text-[11px] text-fg-muted">
                {focused ??
                  'Tab into the chart — arrows walk the data, Enter pins the tooltip.'}
              </p>
            </div>
          )}
          <div className="grid flex-1 gap-x-8 gap-y-5 border-t border-border p-4 sm:grid-cols-2">
            <div className="space-y-5">
              <PanelSection title="Palette">
                <SlotSelect
                  label="Desktop series"
                  value={desktopSlot}
                  onChange={setDesktopSlot}
                />
                <SlotSelect
                  label="Mobile series"
                  value={mobileSlot}
                  onChange={setMobileSlot}
                />
              </PanelSection>
              <PanelSection title="Mark">
                <SegmentedControl
                  aria-label="Mark"
                  selectedKeys={[mark]}
                  onSelectionChange={(keys) => {
                    const next = [...keys][0]
                    if (typeof next === 'string') setMark(next as MarkKind)
                  }}
                  className="w-full"
                >
                  <SegmentedControlItem id="area" className="flex-1">
                    Area
                  </SegmentedControlItem>
                  <SegmentedControlItem id="line" className="flex-1">
                    Line
                  </SegmentedControlItem>
                  <SegmentedControlItem id="bar" className="flex-1">
                    Bar
                  </SegmentedControlItem>
                </SegmentedControl>
                {mark !== 'bar' && (
                  <>
                    <OptionSelect
                      label="Curve"
                      value={curve}
                      onChange={setCurve}
                      options={[
                        { id: 'linear', label: 'Linear' },
                        { id: 'natural', label: 'Natural' },
                        { id: 'monotone', label: 'Monotone' },
                        { id: 'step', label: 'Step' },
                      ]}
                    />
                    <SliderRow
                      label="Stroke width"
                      value={strokeWidth}
                      onChange={setStrokeWidth}
                      minValue={1}
                      maxValue={4}
                      step={0.25}
                    />
                    <SwitchRow
                      label="Points"
                      value={points}
                      onChange={setPoints}
                    />
                  </>
                )}
                {mark === 'area' && (
                  <>
                    <SwitchRow
                      label="Gradient fill"
                      value={gradient}
                      onChange={setGradient}
                    />
                    {!gradient && (
                      <SliderRow
                        label="Fill opacity"
                        value={fillOpacity}
                        onChange={setFillOpacity}
                        minValue={0}
                        maxValue={60}
                        step={5}
                      />
                    )}
                  </>
                )}
                {mark === 'bar' && (
                  <SliderRow
                    label="Corner radius"
                    value={barRadius}
                    onChange={setBarRadius}
                    minValue={0}
                    maxValue={10}
                    step={1}
                  />
                )}
              </PanelSection>
            </div>
            <div className="space-y-5">
              <PanelSection title="Guides">
                <SwitchRow label="Axes" value={axes} onChange={setAxes} />
                <SwitchRow label="Grid" value={grid} onChange={setGrid} />
                <SwitchRow label="Legend" value={legend} onChange={setLegend} />
                <SwitchRow
                  label="Average line"
                  value={refLine}
                  onChange={setRefLine}
                />
              </PanelSection>
              <PanelSection title="Interaction">
                <OptionSelect
                  label="Focus"
                  value={focusMode}
                  onChange={setFocusMode}
                  options={[
                    { id: 'nearest', label: 'Nearest' },
                    { id: 'nearest-x', label: 'Nearest X' },
                    { id: 'group-x', label: 'Group X' },
                  ]}
                />
                <OptionSelect
                  label="Tooltip anchor"
                  value={anchor}
                  onChange={setAnchor}
                  options={[
                    { id: 'point', label: 'Point' },
                    { id: 'pointer', label: 'Pointer' },
                    { id: 'group-center', label: 'Group center' },
                  ]}
                />
                <SwitchRow
                  label="Pinnable tooltip"
                  value={sticky}
                  onChange={setSticky}
                />
                <SwitchRow
                  label="Animate"
                  value={animate}
                  onChange={setAnimate}
                />
              </PanelSection>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
