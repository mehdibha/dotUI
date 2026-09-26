import {
  createElement,
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react"
import type { PressEvent } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { CodeBlock } from "@/modules/docs/code-block"
import { renderCode } from "@/modules/docs/codegen/code-template"
import type { CodeTemplate } from "@/modules/docs/codegen/code-template"
import { DemoPreset } from "@/modules/docs/demo-preset"
import { DynamicPre } from "@/modules/docs/dynamic-pre"
import { PreviewControls, PreviewPanel } from "@/modules/docs/preview-controls"
import { toggleCodeBlock } from "@/modules/docs/toggle-code-block"

import { defaultControlValues } from "./control-defaults"
import { availableIcons, Controls } from "./controls"
import type { ControlValues, SerializableControl } from "./types"

/**
 * Interactive demo component.
 * Renders the playground, controls, and live code output.
 *
 * The preview is the hero: closed, the demo reads as one card (preview over
 * the code bar) and the controls hide behind a corner toggle. Opening splits it
 * into three detached cards — preview, controls, code — each carrying its own
 * border and radius, with the controls card sliding in from the right and
 * *pushing* the preview (the flex sibling reflows) rather than overlaying it.
 * Everything tweens with the drawer easing (--ease-fluid-out): the panel width,
 * the gaps, and the corners that were squared where the cards met. The
 * controls card takes its natural height, so a tall control set extends the
 * row instead of scrolling.
 *
 * The displayed code is filled from a build-time template-with-holes over the
 * real demo source (see codegen/source-overlay.ts). Preview and code derive
 * from one `values` state, so they can never diverge — and the rendered code
 * is always byte-identical to what oxfmt would emit
 * (codegen/playground-fidelity.test.ts holds that line).
 */

interface InteractiveDemoProps {
  component: ComponentType<Record<string, unknown>>
  controls: SerializableControl[]
  codeTemplate: CodeTemplate
  className?: string
}

export function InteractiveDemo({
  component: Playground,
  controls,
  codeTemplate,
  className,
}: InteractiveDemoProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)

  const initialValues = useMemo(
    () => defaultControlValues(controls),
    [controls],
  )
  const [values, setValues] = useState<ControlValues>(initialValues)

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev: ControlValues) => ({ ...prev, [name]: value }))
  }, [])

  // Convert icon names to actual icon elements for preview
  const propsWithIcons = useMemo(() => {
    const props: Record<string, unknown> = { ...values }

    for (const control of controls) {
      if (control.type === "icon") {
        const iconName = values[control.name] as string | null
        if (iconName && availableIcons[iconName]) {
          props[control.name] = createElement(availableIcons[iconName], {
            className: "size-4",
          })
        } else {
          props[control.name] = null
        }
      }
    }

    return props
  }, [values, controls])

  // Real React render — hooks/context/memo all legal in the playground.
  const previewElement = useMemo(
    () => createElement(Playground, propsWithIcons),
    [Playground, propsWithIcons],
  )

  const displayedCode = useMemo(
    () => renderCode(codeTemplate, values, { expanded: isExpanded }),
    [codeTemplate, values, isExpanded],
  )

  const handleToggle = (e: PressEvent) => {
    toggleCodeBlock(e.target, () => setIsExpanded((prev) => !prev))
  }

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row">
        {/* PreviewPanel pins the whole preview column (toolbar + trigger
            included) to the preview mode; the preset only themes the canvas.
            Closed, its bottom corners square off to meet the code card below.
            While the panel is closed, right padding keeps the mode toggle
            clear of the trigger pinned in the corner. */}
        <PreviewPanel
          className={cn(
            "flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border transition-[border-radius] duration-300 ease-fluid-out motion-reduce:transition-none",
            !controlsOpen && "rounded-b-none",
          )}
        >
          {/* The panel trigger stays mounted so its visibility can tween;
              `inert` takes it out of the tab order and the a11y tree while
              hidden. Opening pushes it right, off the preview's edge (the panel
              clips it), as it fades — it has to outrun the mode toggle, which
              slides into the corner as the right padding drops. */}
          <span className="contents" inert={controlsOpen}>
            <Tooltip>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Controls"
                className={cn(
                  "absolute top-2 right-2 z-10 text-fg-muted transition-[opacity,translate] duration-300 ease-fluid-out motion-reduce:transition-none",
                  controlsOpen && "translate-x-12 opacity-0",
                )}
                onPress={() => setControlsOpen(true)}
              >
                <SlidersHorizontalIcon />
              </Button>
              <TooltipContent>Controls</TooltipContent>
            </Tooltip>
          </span>
          <PreviewControls
            className={cn(
              "transition-[padding] duration-300 ease-fluid-out motion-reduce:transition-none",
              !controlsOpen && "pr-11",
            )}
          />
          <DemoPreset>
            <div className="flex min-h-56 flex-1 items-center justify-center bg-bg p-10 pt-14">
              {previewElement}
            </div>
          </DemoPreset>
        </PreviewPanel>

        {/* Controls slot — a bare clip that slides in from the right and pushes
            the preview (the preview is flex-1, so it gives up width as the slot
            grows). The margin is the gap to the preview and tweens with the
            width. The slot carries no border of its own, so it can close to a
            true zero width instead of leaving a bordered sliver. */}
        <div
          className={cn(
            "flex overflow-hidden transition-[width,margin,display] transition-discrete duration-300 ease-fluid-out motion-reduce:transition-none md:shrink-0",
            "starting:mt-0 md:starting:ml-0 md:starting:w-0",
            controlsOpen
              ? "mt-3 flex w-full md:mt-0 md:ml-3 md:w-56"
              : "mt-0 hidden w-full md:ml-0 md:w-0",
          )}
        >
          {/* The card shrinks with the slot so its border stays whole while
              collapsing; the fixed-width content inside is what gets clipped, so
              the controls never reflow mid-slide. Its height animates from the
              closed row height (h-56, = the preview's min height) up to content via
              interpolate-size, and min-h-full keeps it filling the row when the
              preview is taller.
              Starting at h-56 (not 0) means the card height isn't clamped by the
              preview, so it grows in lock-step with the width — same start,
              duration, and easing. */}
          <div
            className={cn(
              "**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted",
              "min-h-full w-full overflow-hidden rounded-lg border bg-card transition-[height] duration-300 ease-fluid-out [interpolate-size:allow-keywords] motion-reduce:transition-none starting:h-56",
              controlsOpen ? "h-auto" : "h-56",
            )}
          >
            {/* Pinned to the card's inner width (w-56 minus its borders). */}
            <div className="flex w-full flex-col gap-4 p-4 md:w-55.5">
              <div className="-my-1 -mr-2 flex items-center justify-between">
                <p className="text-xs font-medium text-fg-muted">Controls</p>
                <Button
                  variant="quiet"
                  size="xs"
                  isIconOnly
                  aria-label="Hide controls"
                  className="text-fg-muted hover:text-fg"
                  onPress={() => setControlsOpen(false)}
                >
                  <XIcon />
                </Button>
              </div>
              <Controls
                controls={controls}
                values={values}
                onChange={handleChange}
                layout="horizontal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Code card — closed, it tucks under the preview (top corners squared,
          borders overlapping into one hairline); open, it detaches below. */}
      <CodeBlock
        className={cn(
          "rounded-lg transition-[border-radius,margin] duration-300 ease-fluid-out motion-reduce:transition-none",
          controlsOpen ? "mt-3" : "-mt-px rounded-t-none",
        )}
        actions={
          <Button
            variant="quiet"
            size="sm"
            className="h-7 gap-1 pr-2 pl-1 text-xs"
            onPress={handleToggle}
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon /> Collapse
              </>
            ) : (
              <>
                <ChevronDownIcon /> Expand
              </>
            )}
          </Button>
        }
      >
        <DynamicPre lang="tsx">{displayedCode}</DynamicPre>
      </CodeBlock>
    </div>
  )
}
