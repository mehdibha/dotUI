import React from 'react'

import { cn } from '@/registry/lib/utils'

import { DemoCode, getSlotContent } from './demo'
import { DemoPreset } from './demo-preset'
import { ExampleCodeModal } from './example-code-modal'

export interface ExampleProps extends React.ComponentProps<'div'> {
  component: React.ComponentType
  title?: string
  /** Registry items to install, injected by the rehype transform. */
  install?: string[]
  children?: React.ReactNode
}

export function Example({
  component: Component,
  title,
  install,
  children,
  className,
  ...props
}: ExampleProps) {
  // A demo `name` that doesn't resolve to a registered component arrives here as `undefined`.
  // Rendering `<undefined />` throws "Element type is invalid" and crashes the whole page, so
  // render nothing instead.
  if (!Component) return null

  // The rehype transform injects two children: the title `<h3>` (kept in the TOC)
  // and a `<DemoCode>` slot holding the build-time-highlighted source. The source
  // is routed to the "Show code" modal, never rendered inline.
  const code = getSlotContent(children, DemoCode)
  const heading = React.Children.toArray(children).filter(
    (child) => !(React.isValidElement(child) && child.type === DemoCode),
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        '[&_h3]:mt-0 [&_h3]:truncate [&_h3]:text-sm [&_h3]:font-normal [&_h3]:tracking-normal [&_h3]:text-fg-muted',
        className,
      )}
      {...props}
    >
      {/* Header row: title left, "Show code" right — like the gallery cards on /charts. */}
      <div className="flex min-h-7 items-center justify-between gap-2 pl-1">
        <div className="min-w-0">{heading}</div>
        {code ? (
          <ExampleCodeModal
            title={title ?? 'Example'}
            component={Component}
            code={code}
            install={install ?? []}
          />
        ) : null}
      </div>

      {/* The demo renders live and interactive in place. Height grows with
          content so tall demos (tables, forms, sidebars) aren't clipped. */}
      <DemoPreset>
        <div
          data-example-preview=""
          className="no-scrollbar flex min-h-32 flex-1 flex-col items-center justify-center gap-6 overflow-x-auto rounded-2xl border bg-card p-6 sm:p-10"
        >
          <Component />
        </div>
      </DemoPreset>
    </div>
  )
}
