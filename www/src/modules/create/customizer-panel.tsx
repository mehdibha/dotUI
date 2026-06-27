import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  MousePointer2Icon,
  ShuffleIcon,
  Undo2Icon,
} from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import * as icons from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { ExamplesIndex } from './__generated__/examples'
import { ChartColorsConfig, ChartColorsSummary } from './chart-colors'
import { CodeOptionsDialog } from './code-options'
import { ColorsConfig, ColorsSummary } from './colors'
import {
  AllComponentsView,
  ComponentDetailView,
  GroupDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
  isGroupId,
} from './components'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  CursorConfig,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from './cursor'
import { ExportFooter } from './export'
import { IconographyConfig } from './iconography'
import {
  DEFAULT_RADIUS_FACTOR,
  DensityConfig,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from './layout'
import { useDesignSystem } from './preset'
import { TypographyConfig } from './typography'

/* -------------------------------- Types -------------------------------- */

interface MenuItem {
  id: string
  title: string
  preview: ReactNode | 'dynamic'
  config: ReactNode | 'dynamic'
}

/* ------------------------------ Animation ------------------------------ */

const stackTransition: Transition = {
  x: { type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] },
}

/* --------------------------------- Menu -------------------------------- */

const menu: MenuItem[] = [
  {
    id: 'colors',
    title: 'Colors',
    preview: <ColorsSummary />,
    config: <ColorsConfig />,
  },
  {
    id: 'chart-colors',
    title: 'Chart colors',
    preview: <ChartColorsSummary />,
    config: <ChartColorsConfig />,
  },
  {
    id: 'typography',
    title: 'Typography',
    preview: (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              Heading
            </span>
            <p className="font-medium">Geist</p>
          </div>
          <p className="font-heading text-2xl leading-none tracking-tight">
            Ag
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              Body
            </span>
            <p className="font-medium">Geist</p>
          </div>
          <p className="font-body text-base leading-none">Ag</p>
        </div>
      </div>
    ),
    config: <TypographyConfig />,
  },
  {
    id: 'iconography',
    title: 'Icon Library',
    preview: (
      <div className="-mt-1 flex flex-col items-start gap-1">
        <p className="font-medium">Lucide icons</p>
        <div className="mt-2 flex w-full items-center gap-2 overflow-hidden text-fg-muted [&_svg]:size-4 [&_svg]:shrink-0">
          {Object.entries(icons)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(0, 20)
            .map(([name, IconComponent]) => (
              <IconComponent key={name} />
            ))}
        </div>
      </div>
    ),
    config: <IconographyConfig />,
  },
  {
    id: 'radius',
    title: 'Radius',
    preview: 'dynamic',
    config: 'dynamic',
  },
  {
    id: 'density',
    title: 'Density',
    preview: 'dynamic',
    config: 'dynamic',
  },
  {
    id: 'cursor',
    title: 'Cursor',
    preview: 'dynamic',
    config: 'dynamic',
  },
]

export const MENU_IDS = new Set(menu.map((m) => m.id))

/* ------------------------------- Shuffle ------------------------------- */

// "Surprise me" pools for the shuffle button — the punchy, always-legible axes
// (accent / radius / density), each curated so any random pick still looks good.
const SHUFFLE_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
]
const SHUFFLE_RADII = ['0', '0.5', '1', '1.5', '2']
const SHUFFLE_DENSITIES = ['compact', 'default', 'comfortable'] as const

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/* -------------------------------- Panel -------------------------------- */

const routeApi = getRouteApi('/_app/create')

export function CustomizerPanel({ className }: { className?: string }) {
  const { panel, preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const {
    designSystem,
    setDesignSystem,
    setComponentParam,
    setToken,
    setDensity,
  } = useDesignSystem()

  const navStack = useMemo(() => (panel ? panel.split('.') : []), [panel])

  // Undo history. Every design change is encoded into the `?preset=` search param
  // with `replace: true`, so the browser back button can't step through edits — we
  // keep our own stack of past preset values and walk back through it. Watching
  // `preset` (not wiring into each setter) captures changes from every config panel,
  // each of which owns a separate `useDesignSystem()` instance but shares this URL.
  const historyRef = useRef<(string | undefined)[]>([])
  const prevPresetRef = useRef<string | undefined>(preset)
  const isUndoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevPresetRef.current === preset) return
    if (isUndoingRef.current) {
      isUndoingRef.current = false
    } else {
      historyRef.current.push(prevPresetRef.current)
      setCanUndo(true)
    }
    prevPresetRef.current = preset
  }, [preset])

  function undo() {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  // Shuffle the always-legible axes (accent / radius / density) in one update so
  // they land as a single history entry that Undo can revert in one step.
  function shuffle() {
    const accent = pickRandom(SHUFFLE_ACCENTS)
    const radius = pickRandom(SHUFFLE_RADII)
    const density = pickRandom(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }

  function push(id: string) {
    // Opening a component switches the live preview to it so param edits are
    // visible immediately — the panel (`panel`) and preview (`preview`) params are
    // otherwise independent, so editing a component while viewing "Cards" showed no
    // feedback. Only components with a preview example switch; menu/group ids don't.
    const switchPreview =
      !MENU_IDS.has(id) && !isGroupId(id) && id in ExamplesIndex
    navigate({
      search: (prev) => ({
        ...prev,
        panel: [...navStack, id].join('.'),
        ...(switchPreview ? { preview: id } : {}),
      }),
    })
  }

  function pop() {
    const next = navStack.slice(0, -1)
    navigate({
      search: (prev) => ({
        ...prev,
        panel: next.length > 0 ? next.join('.') : undefined,
      }),
    })
  }

  // Resolve global theme tokens with fallbacks to their defaults
  const radiusFactor =
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
  const cursorInteractive =
    designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE
  const cursorDisabled =
    designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED

  function renderDynamicPreview(id: string): ReactNode {
    if (id === 'radius') {
      const parsed = Number.parseFloat(radiusFactor)
      const numeric = Number.isFinite(parsed) ? parsed : 1
      return (
        <div className="-mt-1 flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              Factor
            </span>
            <p className="font-medium tabular-nums">{numeric.toFixed(2)}x</p>
          </div>
          <div
            className="size-7 border"
            style={{ borderRadius: `calc(0.5rem * ${numeric})` }}
          />
        </div>
      )
    }
    if (id === 'density') {
      const gapPx =
        designSystem.density === 'compact'
          ? 2
          : designSystem.density === 'default'
            ? 4
            : 7
      return (
        <div className="-mt-1 flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              Mode
            </span>
            <p className="font-medium capitalize">{designSystem.density}</p>
          </div>
          <div
            className="flex flex-col items-end"
            style={{ gap: `${gapPx}px` }}
          >
            <div className="h-[2px] w-7 rounded-full bg-fg-muted" />
            <div className="h-[2px] w-7 rounded-full bg-fg-muted" />
            <div className="h-[2px] w-7 rounded-full bg-fg-muted" />
          </div>
        </div>
      )
    }
    if (id === 'cursor') {
      return (
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px] tracking-widest text-fg-muted uppercase">
                Interactive
              </span>
              <p className="font-medium">{cursorInteractive}</p>
            </div>
            <div
              className="flex size-7 items-center justify-center rounded-md border text-fg-muted"
              style={{ cursor: cursorInteractive }}
            >
              <MousePointer2Icon className="size-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px] tracking-widest text-fg-muted uppercase">
                Disabled
              </span>
              <p className="font-medium">{cursorDisabled}</p>
            </div>
            <div
              className="flex size-7 items-center justify-center rounded-md border text-fg-muted"
              style={{ cursor: cursorDisabled }}
            >
              <MousePointer2Icon className="size-3.5" />
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  function renderDynamicConfig(id: string): ReactNode {
    if (id === 'radius') {
      return (
        <RadiusConfig
          value={radiusFactor}
          onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)}
        />
      )
    }
    if (id === 'density') {
      return (
        <DensityConfig value={designSystem.density} onChange={setDensity} />
      )
    }
    if (id === 'cursor') {
      return (
        <CursorConfig
          interactive={cursorInteractive}
          disabled={cursorDisabled}
          onChange={setToken}
        />
      )
    }
    return null
  }

  function renderStackedView(index: number) {
    const id = navStack[index]
    if (!id) return null

    // Group detail view (group id anywhere in the stack)
    if (isGroupId(id)) {
      return (
        <>
          <ViewHeader title={getGroupDisplayName(id)} onBack={pop} />
          <GroupDetailView
            groupName={id}
            onSelectComponent={(comp) => push(comp)}
          />
        </>
      )
    }

    // Component detail view (non-menu id)
    if (!MENU_IDS.has(id)) {
      return (
        <>
          <ViewHeader title={getComponentDisplayName(id)} onBack={pop} />
          <ComponentDetailView
            componentName={id}
            selectedParams={designSystem.componentParams[id] ?? {}}
            onParamChange={(paramName, value) =>
              setComponentParam(id, paramName, value)
            }
          />
        </>
      )
    }

    const menuItem = menu.find((m) => m.id === id)
    if (!menuItem) return null

    const configNode =
      menuItem.config === 'dynamic' ? renderDynamicConfig(id) : menuItem.config

    return (
      <>
        <ViewHeader title={menuItem.title} onBack={pop} />
        <div className="mt-4 **:data-label:pl-1 **:data-label:text-fg-muted">
          {configNode}
        </div>
      </>
    )
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col rounded-xl border bg-card lg:w-72 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b p-2">
        <div className="flex w-full items-center justify-between gap-2 pl-1">
          <span className="text-sm font-medium">Customize</span>
          <div className="flex items-center gap-1">
            <Button size="sm" isIconOnly aria-label="Shuffle" onPress={shuffle}>
              <ShuffleIcon />
            </Button>
            <Button
              size="sm"
              isIconOnly
              onPress={undo}
              isDisabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2Icon />
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex-1 overflow-hidden">
        {/* Home — always mounted, shifts left when covered */}
        <motion.div
          initial={false}
          animate={{ x: navStack.length > 0 ? '-50%' : 0 }}
          transition={stackTransition}
          className="absolute inset-0 overflow-y-auto p-3"
        >
          <div className="flex flex-col gap-3">
            {menu.map((item) => (
              <ButtonPrimitives.Button
                key={item.id}
                onPress={() => push(item.id)}
                className="flex flex-col items-stretch gap-2 rounded-lg border p-3 text-sm focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
              >
                <div className="text-left text-fg-muted">{item.title}</div>
                <div className="text-left">
                  {item.preview === 'dynamic'
                    ? renderDynamicPreview(item.id)
                    : item.preview}
                </div>
              </ButtonPrimitives.Button>
            ))}

            {/* All components directly accessible from home */}
            <div className="mt-2 flex flex-col gap-2">
              <div className="px-1 text-[10px] tracking-widest text-fg-muted uppercase">
                Components
              </div>
              <AllComponentsView onSelect={(comp) => push(comp)} />
            </div>
          </div>
        </motion.div>

        {/* Stacked views — each layer covers the one below */}
        <AnimatePresence initial={false}>
          {navStack.map((_, index) => {
            const isCovered = index < navStack.length - 1
            return (
              <motion.div
                key={navStack.slice(0, index + 1).join('/')}
                initial={{ x: '100%' }}
                animate={{ x: isCovered ? '-50%' : 0 }}
                exit={{ x: '100%' }}
                transition={stackTransition}
                className="absolute inset-0 scrollbar-none overflow-y-auto overscroll-contain bg-card p-3"
              >
                {renderStackedView(index)}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t p-3">
        <CodeOptionsDialog />
        <ExportFooter />
      </div>
    </div>
  )
}

function ViewHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-3 -ml-1 flex items-center gap-2">
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        onPress={onBack}
        aria-label="Back"
        className="size-6"
      >
        <ChevronLeftIcon />
      </Button>
      <h2 className="text-sm font-medium">{title}</h2>
    </div>
  )
}
