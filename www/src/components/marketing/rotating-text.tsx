'use client'

/**
 * Rotating headline word, modeled on the x.ai hero swap ("...for everything you
 * <verb>."). The lead sentence is static; only the trailing word cycles on an
 * interval. x.ai splits the word into letters; we animate the whole word as one
 * unit so brand logos (v0 / bolt.new / Lovable), which can't be letter-split,
 * animate the same way. The swap motion matches theirs — `{y, opacity, blur(4px)}`,
 * 0.25s, easeOutExpo. The slot springs to the incoming word's measured width so
 * the surrounding text never snaps.
 */

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from 'motion/react'

import { cn } from '@/registry/lib/utils'

export interface RotatingTextSegment {
  /** A run of text. */
  text?: string
  /** Extra classes for a text run (e.g. bold/italic styling). */
  className?: string
  /** An inline logo / wordmark. */
  icon?: ReactNode
}

export interface RotatingTextItem {
  /** Stable key for the animation. */
  id: string
  /** Plain-text reading of the word — the rotation is decorative (the slot renders
	    aria-hidden by the caller), so keep the caller's accessible label in sync with these. */
  text: string
  /** Visual content (text and/or a logo). */
  segments: RotatingTextSegment[]
}

// ── x.ai-matched swap motion ─────────────────────────────────────────────────
const SWAP_DURATION = 0.25
const SWAP_EASE = [0.16, 1, 0.3, 1] as const
const SWAP_SHIFT = '0.32em' // ≈ x.ai's 14px rise, made font-relative
/** Slot width spring so the surrounding text never snaps on a word change. */
const WIDTH_SPRING: Transition = { type: 'spring', stiffness: 260, damping: 30 }

const SWAP_VARIANTS = {
  initial: { opacity: 0, y: SWAP_SHIFT, filter: 'blur(4px)' },
  animate: { opacity: 1, y: '0em', filter: 'blur(0px)' },
  exit: { opacity: 0, y: `-${SWAP_SHIFT}`, filter: 'blur(4px)' },
}
/** Crossfade only — no movement or blur — under prefers-reduced-motion. */
const REDUCED_SWAP_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

function Segments({ item }: { item: RotatingTextItem }) {
  return (
    <>
      {/* Zero-width baseline anchor: gives icon-only words (a logo with no text) a real
			    text baseline, so the slot sits at the same height as text words — no line jump. */}
      <span aria-hidden="true" className="inline-block w-0">
        {'​'}
      </span>
      {item.segments.map((seg, i) =>
        seg.icon ? (
          <span key={i} className="inline-flex items-center">
            {seg.icon}
          </span>
        ) : (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        ),
      )}
    </>
  )
}

interface RotatingWordProps {
  items: RotatingTextItem[]
  /** Time each word stays fully on screen, ms. */
  interval?: number
  /** Typography applied to the swapped word. */
  wordStyle?: CSSProperties
}

/**
 * The cycling trailing word — measured-width slot + whole-word blur-slide swap.
 * Purely decorative: the caller owns the accessible reading (e.g. an `aria-label`
 * on the heading with the subtree `aria-hidden`).
 */
function RotatingWord({
  items,
  interval = 4200,
  wordStyle,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion() ?? false

  useEffect(() => {
    if (items.length <= 1) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval,
    )
    return () => window.clearInterval(id)
  }, [items.length, interval])

  // Measure the incoming word's natural width from the invisible sizer, then animate
  // the slot to it — animating the real `width` (not a transform) keeps the surrounding
  // text from snapping. The ResizeObserver re-measures when the word's natural width
  // changes without an index change: the webfont swapping in over the fallback, or the
  // responsive headline font-size crossing a breakpoint mid-interval.
  const sizerRef = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)
  useEffect(() => {
    const el = sizerRef.current
    if (!el) return
    const measure = () => {
      const next = Math.round(el.scrollWidth)
      setWidth((prev) => (prev === next ? prev : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [index, wordStyle])

  const active = items[index] ?? items[0]
  if (!active) return null

  const swapVariants = reduce ? REDUCED_SWAP_VARIANTS : SWAP_VARIANTS

  return (
    <span className="relative inline-flex items-baseline align-baseline text-fg">
      <motion.span
        // Cap the slot to one line so a taller logo spills out visually (overflow-visible)
        // rather than growing the headline's line height on an icon word.
        className="inline-grid h-[1em] items-baseline overflow-visible"
        animate={width != null ? { width } : undefined}
        // Snap (don't spring) the slot under prefers-reduced-motion: the width change is
        // the one piece of layout motion the variants above don't cover.
        transition={{ width: reduce ? { duration: 0 } : WIDTH_SPRING }}
      >
        {/* Sizer: invisibly holds the current word so the slot keeps a baseline + a
				    measurable width through the swap, and never collapses between words. */}
        <span
          ref={sizerRef}
          style={wordStyle}
          className="invisible col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap"
        >
          <Segments item={active} />
        </span>
        {/* Visible word: swapped sequentially over the sizer (mode="wait"). `initial={false}`
				    so the first word shows statically on load — only later swaps animate. */}
        <span className="col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active.id}
              initial={swapVariants.initial}
              animate={swapVariants.animate}
              exit={swapVariants.exit}
              transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
              style={{ ...wordStyle }}
              className="inline-flex items-baseline whitespace-nowrap"
            >
              <Segments item={active} />
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </span>
  )
}

interface AnimatedHeadlineProps {
  /** Static lead sentence shown before the rotating word. */
  lead: string
  /** The cycling trailing word. */
  items: RotatingTextItem[]
  /** Punctuation appended directly after the rotating word (e.g. "."). */
  trailing?: string
  /** Typography applied to the rotating word. */
  wordStyle?: CSSProperties
  /** Time each rotating word stays on screen, ms. */
  interval?: number
  className?: string
}

export function AnimatedHeadline({
  lead,
  items,
  trailing,
  wordStyle,
  interval,
  className,
}: AnimatedHeadlineProps) {
  return (
    <span className={cn('inline', className)}>
      {lead}{' '}
      <RotatingWord items={items} interval={interval} wordStyle={wordStyle} />
      {trailing}
    </span>
  )
}
