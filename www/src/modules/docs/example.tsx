import type React from 'react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogBody, DialogContent } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

export interface ExampleProps extends React.ComponentProps<'div'> {
  component: React.ComponentType
  title?: string
  children?: React.ReactNode
}

export function Example({
  component: Component,
  title,
  children,
  className,
  ...props
}: ExampleProps) {
  // A demo `name` that doesn't resolve to a registered component arrives here as `undefined`.
  // Rendering `<undefined />` throws "Element type is invalid" and crashes the whole page, so
  // render nothing instead.
  if (!Component) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        '[&_h3]:mt-0 [&_h3]:px-1.5 [&_h3]:py-2 [&_h3]:text-sm [&_h3]:font-normal [&_h3]:tracking-normal [&_h3]:text-fg-muted [&_h3]:capitalize',
        className,
      )}
      {...props}
    >
      {children ?? (title ? <h3>{title}</h3> : null)}
      <div className="relative flex flex-1 flex-col">
        <div
          data-example-preview=""
          tabIndex={-1}
          className="pointer-events-none scrollbar-none flex min-h-32 flex-1 flex-col items-center justify-center gap-6 overflow-x-auto p-6 sm:p-10"
        >
          <Component />
        </div>
        <Dialog>
          <Button
            variant="quiet"
            aria-label={title ? `Expand ${title} example` : 'Expand example'}
            className="absolute inset-0 z-2 size-auto h-auto! border hover:border-border-hover"
          />
          <Modal>
            <DialogContent aria-label={title ? `${title} example` : 'Example'}>
              <DialogBody>
                <Component />
              </DialogBody>
            </DialogContent>
          </Modal>
        </Dialog>
      </div>
    </div>
  )
}
