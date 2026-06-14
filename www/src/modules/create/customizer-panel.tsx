import { type ReactNode, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  MoonIcon,
  MousePointer2Icon,
  ShuffleIcon,
  SunIcon,
  Undo2Icon,
} from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import * as icons from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'
import { componentsData } from '@/modules/docs/components-list/components-data'

import { ExamplesIndex } from './__generated__/examples'
import { ColorsConfig, ColorsSummary } from './colors-config'
import {
  AllComponentsView,
  ComponentDetailView,
  GroupDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
  isGroupId,
} from './components-config'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  CursorConfig,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from './cursor-config'
import { IconographyConfig } from './iconography-config'
import { InstallCommand } from './install-command'
import {
  DEFAULT_RADIUS_FACTOR,
  DensityConfig,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from './layout-config'
import { OpenInV0 } from './open-in-v0'
import { useDesignSystem } from './preset'
import type { PreviewMode } from './preset'
import { TypographyConfig } from './typography-config'

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

/* -------------------------------- Panel -------------------------------- */

const routeApi = getRouteApi('/_app/create')

export function CustomizerPanel({
  previewMode = 'light',
  onTogglePreviewMode,
}: {
  previewMode?: PreviewMode
  onTogglePreviewMode?: () => void
}) {
  const { panel, preview } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setComponentParam, setToken, setDensity } =
    useDesignSystem()

  const navStack = useMemo(() => (panel ? panel.split('.') : []), [panel])

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

  const effectivePreview = preview

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
    <div className="relative flex h-full w-full flex-col rounded-xl border bg-card">
      {/* Header */}
      <div className="relative overflow-hidden border-b p-2">
        <div className="flex w-full items-center gap-2">
          <Select
            value={effectivePreview}
            onChange={(v) =>
              navigate({
                search: (prev) => ({ ...prev, preview: v as string }),
              })
            }
            className="flex-1"
            aria-label="Preview"
          >
            <Button size="sm" className="w-full">
              <SelectValue className="truncate" />
              <ChevronDownIcon data-icon-end="" />
            </Button>
            <Popover>
              <Command>
                <SearchField autoFocus aria-label="Search previews">
                  <Input />
                </SearchField>
                <ListBox>
                  <ListBoxSection>
                    <ListBoxSectionHeader>Blocks</ListBoxSectionHeader>
                    {/* Composed, real-world UI (the landing cards grid), themed live. */}
                    <ListBoxItem id="cards" textValue="Cards">
                      <span className="truncate">Cards</span>
                    </ListBoxItem>
                  </ListBoxSection>
                  <ListBoxSection>
                    <ListBoxSectionHeader>Components</ListBoxSectionHeader>
                    {componentsData
                      .flatMap((category) => category.components)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((comp) => (
                        <ListBoxItem
                          key={comp.slug}
                          id={comp.slug}
                          textValue={comp.name}
                        >
                          <span className="truncate">{comp.name}</span>
                        </ListBoxItem>
                      ))}
                  </ListBoxSection>
                </ListBox>
              </Command>
            </Popover>
          </Select>
          <Button size="sm" isIconOnly>
            <ShuffleIcon />
          </Button>
          <Button
            size="sm"
            isIconOnly
            onPress={onTogglePreviewMode}
            aria-label="Toggle preview mode"
          >
            {previewMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button size="sm" isIconOnly>
            <Undo2Icon />
          </Button>
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
        <p className="px-0.5 text-[10px] font-medium tracking-widest text-fg-muted uppercase">
          Install your design system
        </p>
        <InstallCommand />
        <OpenInV0 />
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
