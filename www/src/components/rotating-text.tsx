'use client'

/**
 * Rotating headline word, modeled on the x.ai hero swap ("...for everything you
 * <verb>."). The lead sentence is static; only the trailing word cycles on an
 * interval. x.ai splits the word into letters; we animate the whole word as one
 * unit so brand logos (v0 / bolt.new / Lovable), which can't be letter-split,
 * animate the same way. The swap is a blur crossfade — `{opacity, blur(6px)}` with no
 * vertical travel, ~0.3s easeOutExpo (exit a touch faster). The word resolves in and
 * out of focus instead of sliding. The slot springs to the incoming word's measured width so
 * the surrounding text never snaps.
 *
 * A destination and its optional connector ("to") render in two independent slots,
 * each keyed by its own content. So a connector shared by consecutive destinations
 * (every "to …") keeps the same key and stays put — only the destination swaps —
 * instead of the "to" pointlessly blurring out and back in on every change.
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
  /** Optional connector rendered before the destination, in the lead's font (e.g. "to ").
	    It lives in its own slot keyed by this string, so a connector shared by consecutive
	    items stays mounted and does not re-animate between them — only the destination swaps.
	    End it with a non-breaking space for the word gap: the slot is sized from this text and
	    a normal trailing space is trimmed. Omit it for items that read without one ("anywhere"). */
  connector?: string
  /** Visual content of the destination (text and/or a logo). */
  segments: RotatingTextSegment[]
}

// ── Blur-crossfade swap motion ─────────────────────────────────────────────────
const SWAP_DURATION = 0.3
const SWAP_EXIT_DURATION = 0.22
const SWAP_EASE = [0.16, 1, 0.3, 1] as const
const SWAP_BLUR = 'blur(6px)'
/** Slot width spring so the surrounding text never snaps on a word change. */
const WIDTH_SPRING: Transition = { type: 'spring', stiffness: 260, damping: 30 }

// No vertical travel: the word resolves in/out of focus via blur + opacity, which reads
// more refined than a slide (and keeps brand logos, which can't be letter-split, swapping
// the same way). The peak blur lands at opacity 0, so you never see sharp-but-blurred text.
// Exit carries its own faster transition so the swap doesn't drag.
const SWAP_VARIANTS = {
  initial: { opacity: 0, filter: SWAP_BLUR },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: {
    opacity: 0,
    filter: SWAP_BLUR,
    transition: { duration: SWAP_EXIT_DURATION, ease: SWAP_EASE },
  },
}
/** Crossfade only — no movement or blur — under prefers-reduced-motion. */
const REDUCED_SWAP_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Zero-width text-baseline anchor. Gives a slot a real text baseline even when its content
 * has none — an icon-only logo, or the connector slot on the no-connector ("anywhere")
 * frame. Without it an empty first slot has no baseline, which drags the rotor's inline-flex
 * baseline down and inflates the headline row (a tall phantom gap below it).
 */
function BaselineAnchor() {
  return (
    <span aria-hidden="true" className="inline-block w-0">
      {'​'}
    </span>
  )
}

function Segments({ item }: { item: RotatingTextItem }) {
  return (
    <>
      <BaselineAnchor />
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

/**
 * One measured-width slot with the blur-crossfade swap. The slot springs its width to
 * the active content; content crossfades via AnimatePresence keyed by `swapKey`. When
 * `swapKey` is unchanged between renders the content stays mounted and does NOT animate
 * — that's what keeps a shared connector static while only the destination swaps.
 * `wordStyle` is applied to the content (Josefin for destinations; omitted for the
 * connector so it inherits the lead's font). Both slots use mode="wait", so the incoming
 * content waits one swap for the outgoing one to clear — that keeps the connector and the
 * destination entering together at a boundary (and means no extra enter delay is needed).
 */
function SwapSlot({
  swapKey,
  children,
  wordStyle,
  reduce,
}: {
  swapKey: string
  children: ReactNode
  wordStyle?: CSSProperties
  reduce: boolean
}) {
  // Measure the active content's natural width from the invisible sizer, then animate the
  // slot to it — animating the real `width` (not a transform) keeps the surrounding text
  // from snapping. The ResizeObserver re-measures when the natural width changes without a
  // key change: the webfont swapping in over the fallback, or the responsive headline
  // font-size crossing a breakpoint mid-interval.
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
  }, [swapKey, wordStyle])

  const swapVariants = reduce ? REDUCED_SWAP_VARIANTS : SWAP_VARIANTS

  return (
    <motion.span
      // Cap the slot to one line so a taller logo spills out visually (overflow-visible)
      // rather than growing the headline's line height on an icon word.
      className="inline-grid h-[1em] items-baseline overflow-visible"
      animate={width != null ? { width } : undefined}
      // Snap (don't spring) the slot under prefers-reduced-motion: the width change is
      // the one piece of layout motion the variants above don't cover.
      transition={{ width: reduce ? { duration: 0 } : WIDTH_SPRING }}
    >
      {/* Sizer: invisibly holds the current content so the slot keeps a baseline + a
			    measurable width through the swap, and never collapses between words. */}
      <span
        ref={sizerRef}
        style={wordStyle}
        className="invisible col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap"
      >
        {children}
      </span>
      {/* Visible content: swapped sequentially over the sizer (mode="wait"). `initial={false}`
			    so the first word shows statically on load — only later swaps animate. */}
      <span className="col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={swapKey}
            initial={swapVariants.initial}
            animate={swapVariants.animate}
            exit={swapVariants.exit}
            transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
            style={wordStyle}
            className="inline-flex items-baseline whitespace-nowrap"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
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
 * The cycling trailing word — a connector slot + a destination slot, each a measured-width
 * blur-crossfade swap. Purely decorative: the caller owns the accessible reading (e.g. an
 * `aria-label` on the heading with the subtree `aria-hidden`).
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

  const active = items[index] ?? items[0]
  if (!active) return null

  const connector = active.connector ?? ''

  return (
    <span className="relative inline-flex items-baseline align-baseline text-fg">
      {/* Connector slot — keyed by the connector text, so the "to" shared across the tool /
			    codebase frames keeps the same key and never re-animates between them. No wordStyle:
			    it inherits the lead's font, matching "Ship it". Empty for the no-connector frame. */}
      <SwapSlot swapKey={connector} reduce={reduce}>
        <BaselineAnchor />
        {connector || null}
      </SwapSlot>
      {/* Destination slot — the cycling logo / keyword in the rotating Josefin style. */}
      <SwapSlot swapKey={active.id} wordStyle={wordStyle} reduce={reduce}>
        <Segments item={active} />
      </SwapSlot>
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
