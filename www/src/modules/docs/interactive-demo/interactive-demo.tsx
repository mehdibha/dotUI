import {
  createElement,
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from 'react'
import { flushSync } from 'react-dom'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { CodeBlock } from '@/modules/docs/code-block'
import { renderCode } from '@/modules/docs/codegen/code-template'
import type { CodeTemplate } from '@/modules/docs/codegen/code-template'
import { DemoPreset } from '@/modules/docs/demo-preset'
import { DynamicPre } from '@/modules/docs/dynamic-pre'
import { PreviewControls, PreviewPanel } from '@/modules/docs/preview-controls'

import { defaultControlValues } from './control-defaults'
import { availableIcons, Controls } from './controls'
import type { ControlValues, SerializableControl } from './types'

/**
 * Interactive demo component.
 * Renders the playground, controls, and live code output.
 *
 * The preview is the hero: the demo owns the full card and the controls hide
 * behind a corner toggle. Opening slides a panel in from the right that *pushes*
 * the preview (the flex sibling reflows) rather than overlaying it — animated
 * with the drawer easing (--ease-fluid-out). The panel takes its natural height,
 * so a tall control set extends the card instead of scrolling.
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
      if (control.type === 'icon') {
        const iconName = values[control.name] as string | null
        if (iconName && availableIcons[iconName]) {
          props[control.name] = createElement(availableIcons[iconName], {
            className: 'size-4',
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

  const handleToggle = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setIsExpanded((prev) => !prev)
        })
      })
    } else {
      setIsExpanded((prev) => !prev)
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border', className)}>
      <div className="flex flex-col md:flex-row">
        {/* PreviewPanel pins the whole preview column (toolbar + trigger
            included) to the preview mode; the preset only themes the canvas.
            While the panel is closed, right padding keeps the mode toggle
            clear of the trigger pinned in the corner. */}
        <PreviewPanel className="flex min-w-0 flex-1 flex-col">
          {/* The panel trigger stays mounted so its visibility can tween;
              `inert` takes it out of the tab order and the a11y tree while
              hidden. */}
          <span className="contents" inert={controlsOpen}>
            <Tooltip>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Controls"
                className={cn(
                  'absolute top-2 right-2 z-10 text-fg-muted transition-[opacity,scale] duration-300 ease-fluid-out motion-reduce:transition-none',
                  controlsOpen && 'scale-50 opacity-0',
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
              'transition-[padding] duration-300 ease-fluid-out motion-reduce:transition-none',
              !controlsOpen && 'pr-11',
            )}
          />
          <DemoPreset>
            <div className="flex min-h-56 flex-1 items-center justify-center bg-bg p-10">
              {previewElement}
            </div>
          </DemoPreset>
        </PreviewPanel>

        {/* Controls column — slides in from the right and pushes the preview (the
            preview is flex-1, so it gives up width as the column grows). The column
            stretches to the row height and carries the bg/divider, so its surface
            always fills the panel — no gap while the height animates. */}
        <div
          className={cn(
            'overflow-hidden border-t bg-card transition-[width,opacity,display] transition-discrete duration-300 ease-fluid-out motion-reduce:transition-none md:shrink-0 md:border-t-0 md:border-l',
            'starting:opacity-0 md:starting:w-0',
            controlsOpen
              ? 'block w-full opacity-100 md:w-56'
              : 'hidden w-full opacity-0 md:w-0',
          )}
        >
          {/* Inner wrapper animates its height from the closed row height (h-56,
              = the preview's min height) up to content via interpolate-size. Starting
              at h-56 (not 0) means the card height isn't clamped by the preview, so it
              grows in lock-step with the width — same start, duration, and easing. */}
          <div
            className={cn(
              '**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted',
              'w-full overflow-hidden transition-[height] duration-300 ease-fluid-out [interpolate-size:allow-keywords] motion-reduce:transition-none md:w-56 starting:h-56',
              controlsOpen ? 'h-auto' : 'h-56',
            )}
          >
            <div className="flex flex-col gap-4 px-5 pt-3 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-fg-muted">
                  Controls
                </span>
                <Tooltip>
                  <Button
                    variant="quiet"
                    size="sm"
                    isIconOnly
                    aria-label="Hide controls"
                    className="-mr-2 text-fg-muted hover:text-fg"
                    onPress={() => setControlsOpen(false)}
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <TooltipContent>Hide controls</TooltipContent>
                </Tooltip>
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
