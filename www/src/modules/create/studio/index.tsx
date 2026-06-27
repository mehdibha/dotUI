'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  CornerDownLeftIcon,
  SearchIcon,
  ShuffleIcon,
  Undo2Icon,
} from 'lucide-react'
import { motion } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { ExamplesIndex } from '../__generated__/examples'
import { getComponentDisplayName } from '../components'
import { ExportFooter } from '../export'
import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { StudioProvider, type SectionId, type StudioMode } from './context'
import {
  pickRandom,
  SECTIONS,
  SHUFFLE_ACCENTS,
  SHUFFLE_DENSITIES,
  SHUFFLE_RADII,
} from './data'
import { Segmented } from './primitives'
import { BrandSection } from './sections/brand'
import { ColorSection } from './sections/color'
import { ComponentsSection } from './sections/components'
import {
  CodeSection,
  DensitySection,
  IconsSection,
  MotionSection,
  ShapeSection,
  SurfaceSection,
  TypographySection,
} from './sections/foundations'

const routeApi = getRouteApi('/_app/create')

const SECTION_COMPONENTS: Record<SectionId, () => React.ReactNode> = {
  brand: BrandSection,
  color: ColorSection,
  typography: TypographySection,
  icons: IconsSection,
  shape: ShapeSection,
  density: DensitySection,
  surface: SurfaceSection,
  motion: MotionSection,
  components: ComponentsSection,
  code: CodeSection,
}

export function StudioPanel({ className }: { className?: string }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()

  const [section, setSection] = useState<SectionId>('brand')
  const [mode, setMode] = useState<StudioMode>('simple')
  const [openComponent, setOpenComponentState] = useState<string | null>(null)
  const [name, setName] = useState('Untitled system')
  const [searchOpen, setSearchOpen] = useState(false)

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#438cd6'

  /* --- Undo: snapshot every preset change, walk back through them. --- */
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
    const previous = historyRef.current.pop()
    if (previous === undefined && historyRef.current.length === 0 && !canUndo)
      return
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  /* --- Shuffle the always-legible axes in one history entry. --- */
  function shuffle() {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: pickRandom(SHUFFLE_DENSITIES),
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: pickRandom(SHUFFLE_RADII),
        },
        color: {
          ...base,
          seeds: { ...base.seeds, accent: pickRandom(SHUFFLE_ACCENTS) },
        },
      }
    })
  }

  /* --- Opening a component switches the live preview to it. --- */
  function setOpenComponent(componentName: string | null) {
    setOpenComponentState(componentName)
    if (componentName && componentName in ExamplesIndex) {
      navigate({ search: (prev) => ({ ...prev, preview: componentName }) })
    }
  }

  function goToSection(id: SectionId) {
    setSection(id)
    if (id !== 'components') setOpenComponentState(null)
  }

  /* --- ⌘K opens the command search. --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const ctx = useMemo(
    () => ({ mode, openComponent, setOpenComponent, goToSection }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, openComponent],
  )

  const ActiveSection = SECTION_COMPONENTS[section]

  return (
    <StudioProvider value={ctx}>
      <div
        className={cn(
          'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[368px] lg:flex-none lg:shrink-0',
          className,
        )}
      >
        {/* Header */}
        <div className="shrink-0 border-b">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span
              className="size-5 shrink-0 rounded-[6px] ring-1 ring-black/15 ring-inset"
              style={{ backgroundColor: accent }}
              aria-hidden
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="System name"
              spellCheck={false}
              className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
            />
            <div className="flex shrink-0 items-center gap-0.5">
              <HeaderIcon
                label="Search (⌘K)"
                onPress={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </HeaderIcon>
              <HeaderIcon label="Surprise me" onPress={shuffle}>
                <ShuffleIcon />
              </HeaderIcon>
              <HeaderIcon label="Undo" onPress={undo} isDisabled={!canUndo}>
                <Undo2Icon />
              </HeaderIcon>
            </div>
          </div>
          {/* Persona switch — the one toggle that serves both audiences */}
          <div className="px-3 pb-2.5">
            <Segmented<StudioMode>
              ariaLabel="Detail level"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'simple', label: 'Simple' },
                { value: 'pro', label: 'Pro' },
              ]}
            />
          </div>
        </div>

        {/* Body: rail + inspector */}
        <div className="relative flex min-h-0 flex-1">
          <Rail active={section} onSelect={goToSection} />
          <div className="relative min-w-0 flex-1">
            {/* key remounts on section change so scroll resets; the fade is a
                pure CSS keyframe that always settles at opacity 1, so content
                can never get stuck invisible if JS animation doesn't run. */}
            <div key={section} className="h-full studio-fade-in">
              <ActiveSection />
            </div>
          </div>

          {searchOpen && (
            <CommandSearch
              onClose={() => setSearchOpen(false)}
              onSection={(id) => {
                goToSection(id)
                setSearchOpen(false)
              }}
              onComponent={(c) => {
                setSection('components')
                setOpenComponent(c)
                setSearchOpen(false)
              }}
            />
          )}
        </div>

        {/* Sticky export footer — the always-visible CTA */}
        <div className="flex shrink-0 flex-col gap-2 border-t p-3">
          <ExportFooter />
        </div>
      </div>
    </StudioProvider>
  )
}

function HeaderIcon({
  label,
  onPress,
  isDisabled,
  children,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        onPress={onPress}
        isDisabled={isDisabled}
        aria-label={label}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/* --------------------------------- Rail --------------------------------- */

function Rail({
  active,
  onSelect,
}: {
  active: SectionId
  onSelect: (id: SectionId) => void
}) {
  return (
    <div className="scrollbar-none flex w-12 shrink-0 flex-col items-center gap-0.5 overflow-y-auto border-r bg-bg/40 py-2">
      {SECTIONS.map((s) => {
        const isActive = active === s.id
        const Icon = s.icon
        return (
          <Tooltip key={s.id} delay={300}>
            <ButtonPrimitives.Button
              onPress={() => onSelect(s.id)}
              aria-label={s.label}
              data-active={isActive || undefined}
              className={cn(
                'relative flex size-9 items-center justify-center rounded-lg text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring',
                isActive && 'bg-neutral text-fg',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="rail-active"
                  className="absolute -left-2 h-5 w-1 rounded-full bg-primary"
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
              <Icon className="size-[18px]" />
            </ButtonPrimitives.Button>
            <TooltipContent placement="right">{s.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

/* ----------------------------- Command search ---------------------------- */

function CommandSearch({
  onClose,
  onSection,
  onComponent,
}: {
  onClose: () => void
  onSection: (id: SectionId) => void
  onComponent: (name: string) => void
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const sectionHits = SECTIONS.filter(
    (s) =>
      !q ||
      s.label.toLowerCase().includes(q) ||
      s.blurb.toLowerCase().includes(q),
  )
  const componentHits = registryUi
    .filter((i) => i.group && i.params && Object.keys(i.params).length > 0)
    .filter((i) => !q || i.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 8)

  return (
    <div className="absolute inset-0 z-30 flex flex-col">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="bg-overlay/40 absolute inset-0 backdrop-blur-[1px]"
      />
      <div className="relative m-2 flex max-h-[80%] studio-fade-in flex-col overflow-hidden rounded-xl border bg-popover shadow-lg">
        <div className="border-b p-1.5">
          <SearchField
            aria-label="Search everything"
            placeholder="Search sections & components…"
            autoFocus
            value={query}
            onChange={setQuery}
            className="w-full"
          />
        </div>
        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto p-1.5">
          {sectionHits.length > 0 && (
            <Group label="Sections">
              {sectionHits.map((s) => (
                <Hit key={s.id} onPress={() => onSection(s.id)}>
                  <s.icon className="size-4 shrink-0 text-fg-muted" />
                  <span className="shrink-0 font-medium">{s.label}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-[11px] text-fg-muted/70">
                    {s.blurb}
                  </span>
                </Hit>
              ))}
            </Group>
          )}
          {componentHits.length > 0 && (
            <Group label="Components">
              {componentHits.map((c) => (
                <Hit key={c.name} onPress={() => onComponent(c.name)}>
                  <CornerDownLeftIcon className="size-3.5 text-fg-muted/60" />
                  <span className="flex-1 truncate">
                    {getComponentDisplayName(c.name)}
                  </span>
                </Hit>
              ))}
            </Group>
          )}
          {sectionHits.length === 0 && componentHits.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-fg-muted">
              Nothing matches "{query}".
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Group({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-1">
      <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-fg-muted/70 uppercase">
        {label}
      </div>
      {children}
    </div>
  )
}

function Hit({
  onPress,
  children,
}: {
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] focus-reset transition-colors hover:bg-neutral focus-visible:bg-neutral focus-visible:outline-none"
    >
      {children}
    </ButtonPrimitives.Button>
  )
}
