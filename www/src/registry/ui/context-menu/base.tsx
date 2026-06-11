'use client'

import type * as React from 'react'
import { OverlayTriggerStateContext } from 'react-aria-components/Dialog'
import {
  MenuContext,
  RootMenuTriggerStateContext,
} from 'react-aria-components/Menu'
import { PopoverContext } from 'react-aria-components/Popover'
import { Provider } from 'react-aria-components/slots'
import { useMenuTriggerState } from 'react-stately/useMenuTriggerState'

import { useContextMenuTrigger } from './use-context-menu-trigger'

interface ContextMenuProps extends Omit<
  React.ComponentProps<'div'>,
  'onContextMenu'
> {
  children: React.ReactNode
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  isDisabled?: boolean
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>
  'aria-label'?: string
}

function ContextMenu({
  children,
  defaultOpen,
  isOpen,
  isDisabled = false,
  onContextMenu,
  onOpenChange,
  'aria-label': ariaLabel = 'Context menu',
  ...triggerProps
}: ContextMenuProps) {
  const state = useMenuTriggerState({ defaultOpen, isOpen, onOpenChange })
  const contextMenu = useContextMenuTrigger({
    state,
    isDisabled,
    onContextMenu,
    triggerProps,
  })

  return (
    <Provider
      values={[
        [
          MenuContext,
          {
            'aria-label': ariaLabel,
            autoFocus: state.focusStrategy || true,
            onClose: state.close,
            ref: contextMenu.menuRef,
          },
        ],
        [OverlayTriggerStateContext, state],
        [RootMenuTriggerStateContext, state],
        [
          PopoverContext,
          {
            trigger: 'ContextMenu',
            triggerRef: contextMenu.anchorRef,
            scrollRef: contextMenu.menuRef,
            placement: 'bottom start',
          },
        ],
      ]}
    >
      <div
        {...contextMenu.triggerProps}
        data-context-menu=""
        data-disabled={isDisabled ? '' : undefined}
        ref={contextMenu.triggerRef}
      >
        {children}
      </div>
      <span
        key={contextMenu.anchor.key}
        ref={contextMenu.anchorRefCallback}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: contextMenu.anchor.size,
          height: contextMenu.anchor.size,
          pointerEvents: 'none',
        }}
      />
    </Provider>
  )
}

export type { ContextMenuProps }
export { ContextMenu }
