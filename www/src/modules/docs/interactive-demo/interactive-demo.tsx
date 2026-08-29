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
} from "lucide-react"
import type { PressEvent } from "react-aria-components"
import * as DialogPrimitives from "react-aria-components/Dialog"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { DialogContent } from "@/registry/ui/dialog"
import { Popover } from "@/registry/ui/popover"
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
 * The preview is the hero: the demo owns the full card and the controls open
 * from a corner toggle into a popover anchored to it.
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
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      {/* PreviewPanel pins the whole preview column (toolbar + trigger
          included) to the preview mode; the preset only themes the canvas.
          Right padding keeps the mode toggle clear of the trigger pinned in
          the corner. */}
      <PreviewPanel className="flex min-w-0 flex-col">
        <DialogPrimitives.DialogTrigger>
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Controls"
              className="absolute top-2 right-2 z-10 text-fg-muted"
            >
              <SlidersHorizontalIcon />
            </Button>
            <TooltipContent>Controls</TooltipContent>
          </Tooltip>
          <Popover
            placement="right top"
            className="w-56 p-4 **:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted"
          >
            <DialogContent
              aria-label="Controls"
              className="flex flex-col gap-4 outline-none"
            >
              <Controls
                controls={controls}
                values={values}
                onChange={handleChange}
                layout="horizontal"
              />
            </DialogContent>
          </Popover>
        </DialogPrimitives.DialogTrigger>
        <PreviewControls className="pr-11" />
        <DemoPreset>
          <div className="flex min-h-56 flex-1 items-center justify-center bg-bg p-10 pt-14">
            {previewElement}
          </div>
        </DemoPreset>
      </PreviewPanel>

      {/* Code bar — split from the panel above by a single thin divider */}
      <CodeBlock
        className="rounded-none border-x-0 border-b-0"
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
