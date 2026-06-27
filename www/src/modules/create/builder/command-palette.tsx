'use client'

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  BoxIcon,
  CornerDownLeftIcon,
  GaugeIcon,
  type LucideIcon,
  SearchIcon,
  ShuffleIcon,
  SlidersHorizontalIcon,
  ZapIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { registryUi } from '@/registry/ui/registry'

import { ExamplesIndex } from '../__generated__/examples'
import { getComponentDisplayName } from '../components'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { FOUNDATION_AXES } from './foundations'
import { EXPOSE_PALETTES_VAR, RADIUS_FACTOR_VAR } from './tokens'

interface CommandItem {
  id: string
  label: string
  section: string
  icon: LucideIcon
  keywords?: string[]
  run: () => void
}

export function CommandPalette({
  open,
  onClose,
  onJump,
}: {
  open: boolean
  onClose: () => void
  onJump: (rowId: string) => void
}) {
  const navigate = getRouteApi('/_app/create').useNavigate()
  const { designSystem, setDensity, setColorSeed, setToken } = useDesignSystem()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo<CommandItem[]>(() => {
    const axisItems: CommandItem[] = FOUNDATION_AXES.map((axis) => ({
      id: `axis:${axis.id}`,
      label: axis.title,
      section: 'Foundations',
      icon: axis.icon,
      keywords: axis.keywords,
      run: () => onJump(`f:${axis.id}`),
    }))

    const componentItems: CommandItem[] = registryUi
      .filter((i) => i.group && i.params && Object.keys(i.params).length > 0)
      .map((i) => ({
        id: `comp:${i.name}`,
        label: getComponentDisplayName(i.name),
        section: 'Components',
        icon: BoxIcon,
        run: () => {
          if (i.name in ExamplesIndex) {
            navigate({ search: (prev) => ({ ...prev, preview: i.name }) })
          }
          onJump(`c:${i.name}`)
        },
      }))

    const densities: Density[] = ['compact', 'default', 'comfortable']
    const actionItems: CommandItem[] = [
      ...densities.map((d) => ({
        id: `set-density:${d}`,
        label: `Set density → ${d.charAt(0).toUpperCase()}${d.slice(1)}`,
        section: 'Actions',
        icon: GaugeIcon,
        keywords: ['density', 'spacing'],
        run: () => setDensity(d),
      })),
      {
        id: 'toggle-palettes',
        label: 'Toggle: expose palettes as foundations',
        section: 'Actions',
        icon: SlidersHorizontalIcon,
        keywords: ['palette', 'ramp', 'foundation'],
        run: () =>
          setToken(
            EXPOSE_PALETTES_VAR,
            designSystem.tokens[EXPOSE_PALETTES_VAR] === 'true'
              ? 'false'
              : 'true',
          ),
      },
      {
        id: 'shuffle-accent',
        label: 'Surprise me — re-roll the brand colour',
        section: 'Actions',
        icon: ShuffleIcon,
        keywords: ['random', 'accent'],
        run: () =>
          setColorSeed(
            'accent',
            `oklch(0.62 0.19 ${Math.floor(Math.random() * 360)})`,
          ),
      },
      ...['0', '0.5', '1', '1.5'].map((r) => ({
        id: `set-radius:${r}`,
        label: `Set radius → ${r}×`,
        section: 'Actions',
        icon: ZapIcon,
        keywords: ['corner', 'rounding'],
        run: () => setToken(RADIUS_FACTOR_VAR, r),
      })),
    ]

    return [...axisItems, ...componentItems, ...actionItems]
    // oxlint-disable-next-line react/exhaustive-deps -- setters are stable; rebuild only when the design system changes
  }, [designSystem])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.section.toLowerCase().includes(q) ||
        i.keywords?.some((k) => k.includes(q)),
    )
  }, [items, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  function commit(item: CommandItem | undefined) {
    if (!item) return
    item.run()
    onClose()
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      commit(filtered[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b px-3.5">
              <SearchIcon className="size-4 shrink-0 text-fg-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to an axis, component, or action…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-fg-muted"
                aria-label="Command palette"
              />
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-fg-muted">
                  No matches.
                </p>
              ) : (
                <PaletteList
                  items={filtered}
                  active={active}
                  onHover={setActive}
                  onCommit={commit}
                />
              )}
            </div>
            <div className="flex items-center gap-3 border-t px-3 py-1.5 text-[11px] text-fg-muted/70">
              <span className="flex items-center gap-1">
                <CornerDownLeftIcon className="size-3" /> select
              </span>
              <span>↑↓ navigate</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PaletteList({
  items,
  active,
  onHover,
  onCommit,
}: {
  items: CommandItem[]
  active: number
  onHover: (i: number) => void
  onCommit: (item: CommandItem) => void
}) {
  let lastSection = ''
  return (
    <>
      {items.map((item, i) => {
        const showHeader = item.section !== lastSection
        lastSection = item.section
        const Icon = item.icon
        return (
          <div key={item.id}>
            {showHeader && (
              <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold tracking-widest text-fg-muted/60 uppercase">
                {item.section}
              </div>
            )}
            <button
              type="button"
              onMouseEnter={() => onHover(i)}
              onClick={() => onCommit(item)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                i === active ? 'bg-neutral text-fg' : 'text-fg-muted',
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          </div>
        )
      })}
    </>
  )
}
