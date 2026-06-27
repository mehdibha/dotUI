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
  PanelRightCloseIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { CodeBlock } from '@/modules/docs/code-block'
import { renderCode } from '@/modules/docs/codegen/code-template'
import type { CodeTemplate } from '@/modules/docs/codegen/code-template'
import { DynamicPre } from '@/modules/docs/dynamic-pre'

import { defaultControlValues } from './control-defaults'
import { availableIcons, Controls } from './controls'
import type { ControlValues, SerializableControl } from './types'

/**
 * Interactive demo component.
 * Renders the playground, controls, and live code output.
 *
 * The preview is the hero: the demo owns the full card, and the controls hide
 * behind a corner toggle. Opening springs them out as an iOS-style popover —
 * scaling from the trigger corner (origin-top-right) with a subtle bounce, the
 * opacity snapping in faster than the scale settles.
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
  const shouldReduceMotion = useReducedMotion()
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
      {/* Preview — borderless open space; the demo is the hero and the controls
          live in a popover that springs from the corner toggle. */}
      <div className="relative flex min-h-56 items-center justify-center p-10">
        {previewElement}

        {!controlsOpen && (
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Controls"
              className="absolute top-3 right-3 text-fg-muted"
              onPress={() => setControlsOpen(true)}
            >
              <SlidersHorizontalIcon />
            </Button>
            <TooltipContent>Controls</TooltipContent>
          </Tooltip>
        )}

        <AnimatePresence>
          {controlsOpen && (
            <motion.div
              key="controls-popover"
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }
              }
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0.1 } }
                  : {
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.15, ease: 'easeOut' },
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.12 }
                  : {
                      type: 'spring',
                      duration: 0.4,
                      bounce: 0.2,
                      opacity: { duration: 0.15, ease: 'easeOut' },
                    }
              }
              className={cn(
                '**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted',
                'absolute top-3 right-3 z-10 flex max-h-[calc(100%-1.5rem)] w-64 max-w-[calc(100%-1.5rem)] origin-top-right flex-col rounded-xl border bg-popover shadow-md',
              )}
            >
              <Tooltip>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Hide controls"
                  className="absolute top-2.5 right-2.5 z-10 bg-popover text-fg-muted"
                  onPress={() => setControlsOpen(false)}
                >
                  <PanelRightCloseIcon />
                </Button>
                <TooltipContent>Hide controls</TooltipContent>
              </Tooltip>
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4">
                <Controls
                  controls={controls}
                  values={values}
                  onChange={handleChange}
                  layout="horizontal"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Code bar — split from the preview above by a single thin divider */}
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
