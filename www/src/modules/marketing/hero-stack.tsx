"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Tooltip } from "@base-ui/react/tooltip"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { ReactAriaIcon } from "@/components/icons/react-aria"
import { ShadcnIcon } from "@/components/icons/shadcn"
import { TailwindIcon } from "@/components/icons/tailwind"

const tools = [
  {
    prefix: "Powered by",
    name: "React Aria",
    href: "https://react-spectrum.adobe.com/react-aria",
    icon: <ReactAriaIcon className="size-5" />,
  },
  {
    prefix: "Styled with",
    name: "Tailwind CSS",
    href: "https://tailwindcss.com",
    icon: <TailwindIcon className="size-8 text-[#38bdf8]" />,
  },
  {
    prefix: "Installed with",
    name: "shadcn CLI",
    href: "https://ui.shadcn.com",
    icon: <ShadcnIcon className="size-6" />,
  },
].map((tool) => ({ ...tool, label: `${tool.prefix} ${tool.name}` }))

type Tool = (typeof tools)[number]

function Label({ tool }: { tool: Tool }) {
  return (
    <>
      {tool.prefix} <span className="font-semibold">{tool.name}</span>
    </>
  )
}

const handle = Tooltip.createHandle<string>()

const logoClass =
  "box-content flex size-8 items-center justify-center px-1.5 py-1 opacity-50 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 outline-none"

const EASE_OUT = [0.16, 1, 0.3, 1] as const // easeOutExpo — arrival
const EASE_IN = [0.55, 0.055, 0.675, 0.19] as const // easeInCubic — departure
const ENTER = 0.18
const EXIT = 0.12
const SHIFT = 6
const BLUR = "blur(3px)"

// The label shifts along the pointer's direction, so text and popup travel read as one move.
const VARIANTS = {
  initial: (dir: number) => ({ opacity: 0, filter: BLUR, x: SHIFT * dir }),
  animate: { opacity: 1, filter: "blur(0px)", x: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    filter: BLUR,
    x: -SHIFT * dir,
    transition: { duration: EXIT, ease: EASE_IN },
  }),
}

const REDUCED_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: EXIT } },
}

function TipLabel({ tool, dir }: { tool: Tool; dir: number }) {
  const reduce = useReducedMotion() ?? false
  const variants = reduce ? REDUCED_VARIANTS : VARIANTS
  const measure = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number>()
  useLayoutEffect(() => {
    setWidth(measure.current?.offsetWidth)
  }, [tool])
  return (
    <motion.div
      className="relative overflow-hidden whitespace-nowrap"
      initial={false}
      animate={{ width }}
      transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }}
    >
      <span ref={measure} aria-hidden className="invisible block w-max">
        <Label tool={tool} />
      </span>
      <AnimatePresence initial={false} custom={dir}>
        <motion.span
          key={tool.label}
          custom={dir}
          className="absolute inset-0"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: ENTER, ease: EASE_OUT }}
        >
          <Label tool={tool} />
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}

function SharedTooltip() {
  // Ref, not state: render runs more than once per payload, so derive dir only on change.
  const prev = useRef({ index: 0, dir: 1 })
  return (
    <Tooltip.Root handle={handle}>
      {({ payload }) => {
        const index = tools.findIndex((tool) => tool.label === payload)
        if (index !== -1 && index !== prev.current.index) {
          prev.current = { index, dir: Math.sign(index - prev.current.index) }
        }
        const { dir } = prev.current
        const tool = tools[prev.current.index]
        if (!tool) return null
        return (
          <Tooltip.Portal>
            <Tooltip.Positioner
              side="bottom"
              sideOffset={6}
              className="transition-transform duration-200 ease-out"
            >
              <Tooltip.Popup className="rounded-(--tooltip-radius) border border-border bg-neutral px-3 py-1.5 text-xs text-fg-on-neutral shadow-[var(--shadow-overlay,none)] transition-[opacity,scale] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                <TipLabel tool={tool} dir={dir} />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        )
      }}
    </Tooltip.Root>
  )
}

function Logo({ tool }: { tool: Tool }) {
  return (
    <Tooltip.Trigger
      handle={handle}
      payload={tool.label}
      delay={0}
      render={<a href={tool.href} target="_blank" rel="noreferrer" />}
      aria-label={tool.label}
      className={logoClass}
    >
      {tool.icon}
    </Tooltip.Trigger>
  )
}

export function HeroStack() {
  return (
    <div className="mt-6 flex items-center">
      {tools.map((tool) => (
        <Logo key={tool.label} tool={tool} />
      ))}
      <SharedTooltip />
    </div>
  )
}
