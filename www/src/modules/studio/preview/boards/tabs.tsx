"use client"

import type { Key } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"

import {
  Board,
  BoardSection,
  Specimen,
  useBoardFocus,
  useDriven,
  useReplay,
  useSteps,
} from "./board"

const PROJECT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "deployments", label: "Deployments" },
  { id: "analytics", label: "Analytics" },
]

const VARIANTS = [
  { variant: "segmented", label: "Segmented" },
  { variant: "line", label: "Line" },
  { variant: "pill", label: "Pill" },
] as const

type Variant = (typeof VARIANTS)[number]["variant"]

// The rows that style one variant only.
const VARIANT_OF_AXIS: Record<string, Variant> = {
  tabIndicator: "line",
  tabsColor: "line",
  tabsPill: "pill",
}

/** The default style, its selection walking across the tabs so the indicator's slide shows. */
function Orientations() {
  const motion = useReplay("tabsMotion")
  const step = useSteps(motion, 1200)
  const [selected, setSelected] = useDriven<Key>(
    motion.running,
    PROJECT_TABS[step % PROJECT_TABS.length]?.id ?? "overview",
    PROJECT_TABS[0]?.id ?? "overview",
  )
  return (
    <div
      inert={motion.running}
      className="flex flex-wrap items-end justify-center gap-x-16 gap-y-8"
    >
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Specimen
          key={orientation}
          label={orientation === "horizontal" ? "Horizontal" : "Vertical"}
        >
          {/* Tall enough for every style's vertical list, so switching styles never reflows. */}
          <div className="flex max-w-full scrollbar-none items-center overflow-x-auto sm:min-h-28">
            <Tabs
              orientation={orientation}
              selectedKey={selected}
              onSelectionChange={setSelected}
            >
              <TabList aria-label="Project">
                {PROJECT_TABS.map(({ id, label }) => (
                  <Tab key={id} id={id}>
                    {label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </div>
        </Specimen>
      ))}
    </div>
  )
}

export default function TabsBoard() {
  const { axis } = useBoardFocus()
  const lit = axis ? VARIANT_OF_AXIS[axis] : undefined
  return (
    <Board id="tabs">
      <BoardSection title="Orientation">
        <Orientations />
      </BoardSection>
      <BoardSection title="Variants" className="gap-x-16 gap-y-8">
        {VARIANTS.map(({ variant, label }) => (
          <Specimen
            key={variant}
            label={label}
            className={cn(
              "transition-opacity duration-300",
              lit && lit !== variant && "opacity-35",
            )}
          >
            <Tabs defaultSelectedKey="code">
              <TabList aria-label={label} variant={variant}>
                <Tab id="code">Code</Tab>
                <Tab id="preview">Preview</Tab>
                <Tab id="console">Console</Tab>
              </TabList>
            </Tabs>
          </Specimen>
        ))}
      </BoardSection>
    </Board>
  )
}
