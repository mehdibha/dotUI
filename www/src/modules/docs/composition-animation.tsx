import 'shiki-magic-move/style.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { parseDate } from '@internationalized/date'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { useTheme } from 'starter-themes'

import {
  CalendarIcon,
  ChevronDownIcon,
  MailIcon,
  MoreHorizontalIcon,
} from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Calendar, RangeCalendar } from '@/registry/ui/calendar'
import { Combobox } from '@/registry/ui/combobox'
import { DateField } from '@/registry/ui/date-field'
import { DatePicker, DateRangePicker } from '@/registry/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Description, Label } from '@/registry/ui/field'
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectTrigger } from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'
import { highlighter } from '@/modules/docs/highlight'

interface Step {
  title: string
  // How long the step stays on screen — proportional to how much the diff
  // asks the reader to take in, not to total snippet length.
  durationMs: number
  code: string
  preview: React.ReactNode
  // Short transitional beat that plays during auto-advance but isn't a
  // clickable stop in the pagination (e.g. building an InputGroup addon by
  // addon before landing on the headline step).
  mid?: boolean
}

const firstStep: Step = {
  title: 'Input',
  durationMs: 2400,
  code: `<Input placeholder="hello@example.com" />`,
  preview: (
    <Input
      aria-label="Email"
      placeholder="hello@example.com"
      className="w-56 [view-transition-name:cmp-field]"
    />
  ),
}

const steps: Step[] = [
  firstStep,
  {
    title: 'TextField',
    durationMs: 2600,
    code: `<TextField>
  <Input placeholder="hello@example.com" />
</TextField>`,
    preview: (
      <TextField aria-label="Email" className="w-56">
        <Input
          placeholder="hello@example.com"
          className="[view-transition-name:cmp-field]"
        />
      </TextField>
    ),
  },
  {
    title: 'Label & Description',
    durationMs: 3200,
    code: `<TextField>
  <Label>Email</Label>
  <Input placeholder="hello@example.com" />
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-56">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <Input
          placeholder="hello@example.com"
          className="[view-transition-name:cmp-field]"
        />
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Mid beat: wrap the input in an InputGroup — no addons yet.
    title: 'InputGroup',
    mid: true,
    durationMs: 1500,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <Input placeholder="hello@example.com" />
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <Input placeholder="hello@example.com" />
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Mid beat: add the leading addon.
    title: 'InputGroup',
    mid: true,
    durationMs: 1500,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="hello@example.com" />
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="hello@example.com" />
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Headline step: add the trailing addon — the full InputGroup.
    title: 'InputGroup',
    durationMs: 4200,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="hello@example.com" />
    <InputGroupAddon>
      <Button size="sm">Subscribe</Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="hello@example.com" />
          <InputGroupAddon>
            <Button size="sm" className="[view-transition-name:cmp-trigger]">
              Subscribe
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    title: 'DateField',
    durationMs: 3400,
    code: `<DateField>
  <Label>Meeting date</Label>
  <InputGroup>
    <InputGroupAddon>
      <CalendarIcon />
    </InputGroupAddon>
    <DateInput />
  </InputGroup>
</DateField>`,
    preview: (
      <DateField className="w-56" defaultValue={parseDate('2026-07-10')}>
        <Label className="[view-transition-name:cmp-label]">Meeting date</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <CalendarIcon />
          </InputGroupAddon>
          <DateInput />
        </InputGroup>
      </DateField>
    ),
  },
  {
    title: 'DatePicker',
    durationMs: 4200,
    code: `<DatePicker>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>`,
    preview: (
      <DatePicker className="w-56" defaultValue={parseDate('2026-07-10')}>
        <Label className="[view-transition-name:cmp-label]">Meeting date</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <Calendar />
          </DialogContent>
        </Popover>
      </DatePicker>
    ),
  },
  {
    title: 'DateRangePicker',
    durationMs: 3600,
    code: `<DateRangePicker>
  <Label>Trip dates</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>`,
    preview: (
      <DateRangePicker
        className="w-64"
        defaultValue={{
          start: parseDate('2026-07-10'),
          end: parseDate('2026-07-17'),
        }}
      >
        <Label className="[view-transition-name:cmp-label]">Trip dates</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Popover>
      </DateRangePicker>
    ),
  },
  {
    title: 'Drawer overlay',
    durationMs: 3000,
    code: `<DateRangePicker>
  <Label>Trip dates</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Drawer placement="bottom">
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Drawer>
</DateRangePicker>`,
    preview: (
      <DateRangePicker
        className="w-64"
        defaultValue={{
          start: parseDate('2026-07-10'),
          end: parseDate('2026-07-17'),
        }}
      >
        <Label className="[view-transition-name:cmp-label]">Trip dates</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Drawer placement="bottom">
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Drawer>
      </DateRangePicker>
    ),
  },
  {
    title: 'Select',
    durationMs: 3400,
    code: `<Select>
  <Label>Provider</Label>
  <SelectTrigger />
  <Popover>
    <ListBox>
      <ListBoxItem>Perplexity</ListBoxItem>
      <ListBoxItem>Replicate</ListBoxItem>
      <ListBoxItem>Together AI</ListBoxItem>
    </ListBox>
  </Popover>
</Select>`,
    preview: (
      <Select className="w-56" defaultSelectedKey="perplexity">
        <Label className="[view-transition-name:cmp-label]">Provider</Label>
        <SelectTrigger className="[view-transition-name:cmp-trigger]" />
        <Popover>
          <ListBox>
            <ListBoxItem id="perplexity">Perplexity</ListBoxItem>
            <ListBoxItem id="replicate">Replicate</ListBoxItem>
            <ListBoxItem id="together-ai">Together AI</ListBoxItem>
          </ListBox>
        </Popover>
      </Select>
    ),
  },
  {
    title: 'Menu',
    durationMs: 3200,
    code: `<Menu>
  <Button size="sm" isIconOnly>
    <MoreHorizontalIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Delete</MenuItem>
    </MenuContent>
  </Popover>
</Menu>`,
    preview: (
      <Menu>
        <Button
          size="sm"
          isIconOnly
          aria-label="Actions"
          className="[view-transition-name:cmp-trigger]"
        >
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    ),
  },
  {
    title: 'Dialog',
    durationMs: 3400,
    code: `<Dialog>
  <Button>Create issue</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new issue</DialogTitle>
        <DialogDescription>
          Report a bug or request a feature.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Modal>
</Dialog>`,
    preview: (
      <Dialog>
        <Button className="[view-transition-name:cmp-trigger]">
          Create issue
        </Button>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new issue</DialogTitle>
              <DialogDescription>
                Report a bug or request a feature.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Modal>
      </Dialog>
    ),
  },
  {
    // The finale: every part introduced above, recomposed into one component.
    title: 'ComboBox',
    durationMs: 4200,
    code: `<Combobox>
  <Label>Country</Label>
  <InputGroup>
    <Input placeholder="Search countries…" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>France</ListBoxItem>
      <ListBoxItem>Germany</ListBoxItem>
      <ListBoxItem>Tunisia</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>`,
    preview: (
      <Combobox className="w-64">
        <Label className="[view-transition-name:cmp-label]">Country</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <Input placeholder="Search countries…" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <ListBox>
            <ListBoxItem>France</ListBoxItem>
            <ListBoxItem>Germany</ListBoxItem>
            <ListBoxItem>Tunisia</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
    ),
  },
]

// Pagination lists only the headline steps; mid steps play during auto-advance
// but aren't clickable stops. Each entry keeps its index into `steps` so the
// rail/dots can jump straight to it.
const paginatedSteps = steps
  .map((s, index) => ({ title: s.title, index, mid: s.mid }))
  .filter((s) => !s.mid)

export type CompositionPlayer = ReturnType<typeof useCompositionPlayer>

// Shared player: auto-advance while visible, with a CSS animation as the step
// clock (see StepTimer) so the visible progress and the advance tick can never
// drift. Hovering or focusing the showcase pauses; the play/pause button is a
// sticky override. Every step change routes through a view transition so the
// preview's named parts (field shell, label, trigger…) morph instead of swap.
export function useCompositionPlayer({
  durationScale = 1,
  midDurationMs,
}: { durationScale?: number; midDurationMs?: number } = {}) {
  const [step, setStep] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hoverPaused, setHoverPausedState] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Auto-play is motion — reduced-motion users opt in via the play button.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setUserPaused(true)
    }
  }, [])

  // Only animate while on screen — the clock parks itself otherwise.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  // Touch devices fire synthetic mouseenter with no matching leave — hover
  // pause would stick forever, so it only applies to real pointers.
  const setHoverPaused = useCallback((next: boolean) => {
    if (
      next &&
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return
    setHoverPausedState(next)
  }, [])

  // A view transition lifts every named element into a snapshot overlay that is
  // anchored to the viewport, not the scrolling page — so scrolling mid-morph
  // makes the frozen snapshots detach and float. Skip the morph while scrolling,
  // and snap any in-flight one to its end so it can't drift.
  const scrollingRef = useRef(false)
  const activeTransitionRef = useRef<{ skipTransition: () => void } | null>(
    null,
  )
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      scrollingRef.current = true
      activeTransitionRef.current?.skipTransition()
      clearTimeout(timer)
      timer = setTimeout(() => {
        scrollingRef.current = false
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  const stepRef = useRef(0)
  const goToStep = useCallback((next: number) => {
    stepRef.current = next
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || scrollingRef.current || !document.startViewTransition) {
      setStep(next)
      return
    }
    const transition = document.startViewTransition(() => {
      flushSync(() => setStep(next))
    })
    activeTransitionRef.current = transition
    transition.finished.finally(() => {
      if (activeTransitionRef.current === transition)
        activeTransitionRef.current = null
    })
  }, [])

  const advance = useCallback(
    () => goToStep((stepRef.current + 1) % steps.length),
    [goToStep],
  )

  const togglePlay = useCallback(() => {
    setUserPaused((paused) => !paused)
    // Resuming with the cursor still inside must actually resume.
    setHoverPausedState(false)
  }, [])

  const playing = mounted && inView && !hidden && !userPaused && !hoverPaused
  const current = steps[step] ?? firstStep
  // A mid step maps to the headline step it's building toward (the next
  // paginated entry), so that entry stays lit while the beats play.
  const activePaginated = Math.max(
    0,
    paginatedSteps.findIndex((p) => p.index >= step),
  )
  // Mid steps share one dwell time; the tweaker can override it (undefined in
  // production, where each mid keeps its own durationMs).
  const stepDurationMs =
    (current.mid ? (midDurationMs ?? current.durationMs) : current.durationMs) *
    durationScale
  const reducedMotion =
    mounted && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Under reduced motion the CSS clock is disabled (StepTimer renders nothing),
  // so an explicit play falls back to a plain timeout with instant swaps.
  useEffect(() => {
    if (!playing || !reducedMotion) return
    const id = setTimeout(advance, stepDurationMs)
    return () => clearTimeout(id)
  }, [playing, reducedMotion, step, stepDurationMs, advance])

  return {
    steps,
    step,
    goToStep,
    advance,
    playing,
    userPaused,
    togglePlay,
    setHoverPaused,
    mounted,
    containerRef,
    current,
    stepDurationMs,
    reducedMotion,
    paginated: paginatedSteps,
    activePaginated,
  }
}

// The step clock: an invisible bar animating over the step's duration. Render
// exactly one per player — onAnimationEnd is what advances the sequence, so
// the decorative progress bars (same animation, same play state) stay in sync
// with the actual tick by construction.
export function StepTimer({ player }: { player: CompositionPlayer }) {
  const { step, stepDurationMs, playing, advance, reducedMotion } = player
  if (reducedMotion) return null
  return (
    <span
      key={step}
      aria-hidden
      onAnimationEnd={advance}
      className="pointer-events-none fixed size-px opacity-0"
      style={progressStyle(stepDurationMs, playing, 'x')}
    />
  )
}

function progressStyle(
  durationMs: number,
  playing: boolean,
  axis: 'x' | 'y',
): React.CSSProperties {
  return {
    animationName: axis === 'x' ? 'cmp-progress-x' : 'cmp-progress-y',
    animationDuration: `${durationMs}ms`,
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationPlayState: playing ? 'running' : 'paused',
    willChange: 'transform',
  }
}

// A track clipping a full-size bar that slides in via translate — scaling a
// hairline bar re-rasterizes it every frame and visibly steps at slow speeds.
export function StepProgress({
  player,
  axis = 'x',
  className,
}: {
  player: CompositionPlayer
  axis?: 'x' | 'y'
  className?: string
}) {
  const { step, stepDurationMs, playing, reducedMotion } = player
  return (
    <span key={step} aria-hidden className={cn('overflow-hidden', className)}>
      <span
        className="block size-full bg-fg"
        style={
          reducedMotion
            ? undefined
            : progressStyle(stepDurationMs, playing, axis)
        }
      />
    </span>
  )
}

export function StepDots({
  player,
  className,
}: {
  player: CompositionPlayer
  className?: string
}) {
  const { paginated, activePaginated, goToStep } = player
  return (
    <div className={cn('flex items-center', className)}>
      {paginated.map((p, pos) => (
        <button
          key={p.title}
          type="button"
          aria-label={`Step ${pos + 1}: ${p.title}`}
          aria-current={pos === activePaginated ? 'step' : undefined}
          onClick={() => goToStep(p.index)}
          className="group flex h-8 cursor-pointer items-center px-[3px]"
        >
          <span
            className={cn(
              'relative h-1 overflow-hidden rounded-full transition-all duration-300',
              pos === activePaginated
                ? 'w-5 bg-border'
                : 'w-1.5 bg-border group-hover:bg-fg-muted',
            )}
          >
            {pos === activePaginated && (
              <StepProgress
                player={player}
                className="absolute inset-0 block rounded-full"
              />
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

export function PlayPauseButton({
  player,
  className,
}: {
  player: CompositionPlayer
  className?: string
}) {
  const { userPaused, togglePlay } = player
  return (
    <Button
      size="sm"
      variant="quiet"
      isIconOnly
      aria-label={userPaused ? 'Play steps' : 'Pause steps'}
      onPress={togglePlay}
      className={cn('text-fg-muted', className)}
    >
      {userPaused ? <PlayIcon /> : <PauseIcon />}
    </Button>
  )
}

export function CompositionTransitionStyles({
  morphMs = 450,
}: { morphMs?: number } = {}) {
  return (
    <style>{`
      /* Keep the page interactive while a transition runs, and confine the
         animation to the named preview parts — everything else swaps instantly. */
      ::view-transition { pointer-events: none; }
      ::view-transition-old(root) { display: none; }
      ::view-transition-new(root) { animation: none; }
      ::view-transition-group(cmp-field),
      ::view-transition-group(cmp-label),
      ::view-transition-group(cmp-desc),
      ::view-transition-group(cmp-trigger) {
        animation-duration: ${morphMs}ms;
        animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      ::view-transition-old(cmp-code) { display: none; }
      ::view-transition-new(cmp-code) { animation: none; }
      @keyframes cmp-progress-x { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      @keyframes cmp-progress-y { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-group(*),
        ::view-transition-old(*),
        ::view-transition-new(*) { animation: none; }
      }
    `}</style>
  )
}

export function CompositionCode({
  code,
  reducedMotion,
  duration = 700,
  stagger = 2,
}: {
  code: string
  reducedMotion: boolean
  duration?: number
  stagger?: number
}) {
  const { resolvedTheme } = useTheme()
  return (
    <ShikiMagicMove
      highlighter={highlighter}
      lang="tsx"
      theme={resolvedTheme === 'light' ? 'github-light' : 'github-dark'}
      code={code}
      options={{
        duration: reducedMotion ? 0 : duration,
        stagger,
        containerStyle: false,
      }}
    />
  )
}

export function CompositionAnimation({ className }: { className?: string }) {
  const player = useCompositionPlayer()
  const { mounted, containerRef, current, reducedMotion, setHoverPaused } =
    player

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden rounded-md border bg-card', className)}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      <CompositionTransitionStyles />
      <StepTimer player={player} />
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pr-1.5 pl-2.5">
        <span className="truncate font-mono text-[0.8125rem] text-fg-muted">
          {current.title}
        </span>
        <div className="flex items-center gap-1">
          <StepDots player={player} />
          <PlayPauseButton player={player} />
        </div>
      </div>
      <div className="grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="no-scrollbar h-88 overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed [view-transition-name:cmp-code]">
          {mounted ? (
            <CompositionCode
              code={current.code}
              reducedMotion={reducedMotion}
            />
          ) : (
            <pre className="whitespace-pre">{current.code}</pre>
          )}
        </div>
        <div className="flex min-h-40 items-center justify-center border-t bg-bg p-6 sm:border-t-0 sm:border-l">
          {current.preview}
        </div>
      </div>
    </div>
  )
}
