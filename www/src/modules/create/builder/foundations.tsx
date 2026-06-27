'use client'

import type { ComponentType } from 'react'
import {
  BoxSelectIcon,
  GaugeIcon,
  LayersIcon,
  type LucideIcon,
  MoonIcon,
  MousePointer2Icon,
  PaletteIcon,
  ShapesIcon,
  SmileIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import { ChartColorsConfig, ChartColorsSummary } from '../chart-colors'
import {
  AppearanceAxis,
  AppearanceSummary,
  BordersAxis,
  BordersSummary,
  DensityAxis,
  DensitySummary,
  ElevationAxis,
  ElevationSummary,
  EXPOSED_PALETTES,
  IconographyAxis,
  IconographySummary,
  InteractionAxis,
  InteractionSummary,
  MotionAxis,
  MotionSummary,
  PaletteFoundationAxis,
  paletteSummary,
  RadiusAxis,
  RadiusSummary,
  TypographyAxis,
  TypographySummary,
} from './axes'
import { ColorsAxis, ColorsSummary } from './axis-colors'
import type { Binding } from './primitives'
import { SpineRow } from './spine-row'
import { EXPOSE_PALETTES_VAR, useToken } from './tokens'

export interface AxisDef {
  id: string
  title: string
  icon: LucideIcon
  binding: Binding
  Summary: ComponentType
  Axis: ComponentType
  keywords?: string[]
}

export const FOUNDATION_AXES: AxisDef[] = [
  {
    id: 'colors',
    title: 'Colors',
    icon: PaletteIcon,
    binding: 'live',
    Summary: ColorsSummary,
    Axis: ColorsAxis,
    keywords: ['accent', 'brand', 'palette', 'ramp', 'oklch'],
  },
  {
    id: 'typography',
    title: 'Typography',
    icon: TypeIcon,
    binding: 'stub',
    Summary: TypographySummary,
    Axis: TypographyAxis,
    keywords: ['font', 'scale', 'heading', 'body'],
  },
  {
    id: 'iconography',
    title: 'Iconography',
    icon: SmileIcon,
    binding: 'stub',
    Summary: IconographySummary,
    Axis: IconographyAxis,
    keywords: ['icons', 'lucide', 'stroke'],
  },
  {
    id: 'density',
    title: 'Density',
    icon: GaugeIcon,
    binding: 'live',
    Summary: DensitySummary,
    Axis: DensityAxis,
    keywords: ['compact', 'comfortable', 'spacing'],
  },
  {
    id: 'radius',
    title: 'Radius',
    icon: ShapesIcon,
    binding: 'live',
    Summary: RadiusSummary,
    Axis: RadiusAxis,
    keywords: ['corner', 'rounding'],
  },
  {
    id: 'borders',
    title: 'Borders',
    icon: BoxSelectIcon,
    binding: 'stub',
    Summary: BordersSummary,
    Axis: BordersAxis,
    keywords: ['stroke', 'width'],
  },
  {
    id: 'elevation',
    title: 'Elevation & surfaces',
    icon: LayersIcon,
    binding: 'stub',
    Summary: ElevationSummary,
    Axis: ElevationAxis,
    keywords: ['shadow', 'glass', 'blur', 'depth'],
  },
  {
    id: 'motion',
    title: 'Motion',
    icon: ZapIcon,
    binding: 'stub',
    Summary: MotionSummary,
    Axis: MotionAxis,
    keywords: ['animation', 'duration', 'transition'],
  },
  {
    id: 'interaction',
    title: 'Interaction',
    icon: MousePointer2Icon,
    binding: 'live',
    Summary: InteractionSummary,
    Axis: InteractionAxis,
    keywords: ['cursor', 'focus'],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: MoonIcon,
    binding: 'stub',
    Summary: AppearanceSummary,
    Axis: AppearanceAxis,
    keywords: ['mode', 'dark', 'light'],
  },
  {
    id: 'chart-colors',
    title: 'Chart colors',
    icon: PaletteIcon,
    binding: 'live',
    Summary: ChartColorsSummary,
    Axis: ChartColorsConfig,
    keywords: ['data', 'categorical', 'series'],
  },
]

export function FoundationsZone({
  openIds,
  onToggle,
}: {
  openIds: Set<string>
  onToggle: (id: string) => void
}) {
  const [exposed] = useToken(EXPOSE_PALETTES_VAR, 'false')
  const palettesOn = exposed === 'true'

  return (
    <div className="flex flex-col gap-0.5">
      {FOUNDATION_AXES.map((axis) => {
        const { Summary, Axis } = axis
        const rows = [
          <SpineRow
            key={axis.id}
            id={`f:${axis.id}`}
            title={axis.title}
            icon={axis.icon}
            binding={axis.binding}
            summary={<Summary />}
            isOpen={openIds.has(`f:${axis.id}`)}
            onToggle={() => onToggle(`f:${axis.id}`)}
          >
            <Axis />
          </SpineRow>,
        ]

        // Palette foundations bloom in directly under Colors when exposed.
        if (axis.id === 'colors' && palettesOn) {
          for (const palette of EXPOSED_PALETTES) {
            const PaletteSummary = paletteSummary(palette)
            rows.push(
              <SpineRow
                key={`palette:${palette}`}
                id={`f:palette:${palette}`}
                title={`${palette.charAt(0).toUpperCase()}${palette.slice(1)} ramp`}
                summary={<PaletteSummary />}
                isOpen={openIds.has(`f:palette:${palette}`)}
                onToggle={() => onToggle(`f:palette:${palette}`)}
              >
                <PaletteFoundationAxis palette={palette} />
              </SpineRow>,
            )
          }
        }
        return rows
      })}
    </div>
  )
}
