import {
  createElement,
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from 'react'
import { flushSync } from 'react-dom'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
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
  /**
   * Where the controls sit on ≥md screens: a column to the right ("horizontal")
   * or a row beneath the preview ("vertical"). Small screens are always "vertical".
   */
  layout?: 'horizontal' | 'vertical'
}

export function InteractiveDemo({
  component: Playground,
  controls,
  codeTemplate,
  className,
  layout = 'horizontal',
}: InteractiveDemoProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // "horizontal" puts the controls in a column to the right of the preview at md+; below md
  // (and for "vertical") they sit in a wrapping row beneath it. The small↔large switch is pure
  // CSS via md: variants — no JS media query — so SSR and the first client render match exactly
  // (no hydration mismatch, no flash). A side column wouldn't fit on small screens anyway.
  const horizontal = layout === 'horizontal'
  const controlListClass = cn(
    'flex-row flex-wrap items-start gap-x-6 gap-y-4',
    horizontal && 'md:flex-col md:flex-nowrap',
  )

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
      <div className={cn('flex flex-col', horizontal && 'md:flex-row')}>
        {/* Preview — borderless open space (no card, no backdrop); the demo just sits in it */}
        <div className="flex min-h-56 flex-1 items-center justify-center p-10">
          {previewElement}
        </div>

        {/* Controls — bare, no card chrome: a self-sizing column to the right at md+ when
				    horizontal (clamped by min/max width), otherwise a wrapping row beneath the preview. */}
        <div
          className={cn(
            '**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted',
            'flex p-5',
            controlListClass,
            // Right column at md+: drop the left padding (the preview's flex space is the gap)
            // and let it size to content between a min and max instead of a fixed width.
            horizontal && 'md:max-w-72 md:min-w-52 md:shrink-0 md:pl-0',
          )}
        >
          <Controls
            controls={controls}
            values={values}
            onChange={handleChange}
            layout={layout}
          />
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
