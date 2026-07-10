import 'shiki-magic-move/style.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { parseDate } from '@internationalized/date'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { useTheme } from 'starter-themes'

import {
  CalendarIcon,
  MailIcon,
  MoreHorizontalIcon,
} from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Calendar, RangeCalendar } from '@/registry/ui/calendar'
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
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'
import { highlighter } from '@/modules/docs/highlight'

const STEP_MS = 3200

interface Step {
  title: string
  code: string
  preview: React.ReactNode
}

const firstStep: Step = {
  title: 'Input',
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
    title: 'InputGroup',
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
    title: 'Same picker, drawer overlay',
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
    title: 'Dialog',
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
    title: 'Menu',
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
]

// Shared player: auto-advance while visible, pause on hover/focus, and route
// every step change through a view transition so the preview's named parts
// (field shell, label, trigger…) morph instead of swapping.
export function useCompositionPlayer() {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // Only animate while on screen — the loop parks itself otherwise.
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

  const stepRef = useRef(0)
  const goToStep = useCallback((next: number) => {
    stepRef.current = next
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !document.startViewTransition) {
      setStep(next)
      return
    }
    document.startViewTransition(() => {
      flushSync(() => setStep(next))
    })
  }, [])

  useEffect(() => {
    if (paused || !inView || !mounted) return
    const id = setInterval(
      () => goToStep((stepRef.current + 1) % steps.length),
      STEP_MS,
    )
    return () => clearInterval(id)
  }, [paused, inView, mounted, goToStep])

  const current = steps[step] ?? firstStep
  const reducedMotion =
    mounted && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    steps,
    step,
    goToStep,
    setPaused,
    mounted,
    containerRef,
    current,
    reducedMotion,
  }
}

export function CompositionTransitionStyles() {
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
        animation-duration: 450ms;
        animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      ::view-transition-old(cmp-code) { display: none; }
      ::view-transition-new(cmp-code) { animation: none; }
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
}: {
  code: string
  reducedMotion: boolean
}) {
  const { resolvedTheme } = useTheme()
  return (
    <ShikiMagicMove
      highlighter={highlighter}
      lang="tsx"
      theme={resolvedTheme === 'light' ? 'github-light' : 'github-dark'}
      code={code}
      options={{
        duration: reducedMotion ? 0 : 700,
        stagger: 2,
        containerStyle: false,
      }}
    />
  )
}

export function CompositionAnimation({ className }: { className?: string }) {
  const {
    step,
    goToStep,
    setPaused,
    mounted,
    containerRef,
    current,
    reducedMotion,
  } = useCompositionPlayer()

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden rounded-md border bg-card', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <CompositionTransitionStyles />
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pr-2.5 pl-2.5">
        <span className="truncate font-mono text-[0.8125rem] text-fg-muted">
          {current.title}
        </span>
        <div className="flex items-center">
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Step ${i + 1}: ${s.title}`}
              onClick={() => goToStep(i)}
              className="group flex size-5 cursor-pointer items-center justify-center"
            >
              <span
                className={cn(
                  'size-1.5 rounded-full transition-colors',
                  i === step ? 'bg-fg' : 'bg-border group-hover:bg-fg-muted',
                )}
              />
            </button>
          ))}
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
