'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as ModalPrimitives from 'react-aria-components/Modal'
import { useIsHidden } from 'react-aria/private/collections/Hidden'
import { tv } from 'tailwind-variants'
const modalVariants = tv({
  slots: {
    overlay:
      'group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full',
    backdrop: [
      'absolute inset-0 bg-black/(--modal-backdrop-opacity) backdrop-blur-sm duration-200 group-exiting/modal:duration-150',
      'transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0',
    ],
    viewport:
      '@container-[size] sticky top-0 left-0 flex h-(--visual-viewport-height) w-full items-center justify-center',
    modal: [
      'relative flex max-h-[calc(var(--visual-viewport-height)-2rem)] w-full max-w-[calc(100vw-2rem)] flex-col rounded-lg border bg-(--modal-background) shadow-lg sm:max-h-[calc(var(--visual-viewport-height)*.9)]',
      'transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]',
      'duration-200 entering:scale-95 entering:opacity-0',
      'exiting:scale-95 exiting:opacity-0 exiting:duration-150',
      'sm:max-w-sm',
    ],
  },
})

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => {
  const isHidden = useIsHidden()

  if (isHidden) {
    return <>{children}</>
  }

  return (
    <ModalOverlay {...props}>
      <ModalBackdrop />
      <ModalViewport>
        <ModalPanel className={className}>{children}</ModalPanel>
      </ModalViewport>
    </ModalOverlay>
  )
}

interface ModalOverlayProps extends React.ComponentProps<
  typeof ModalPrimitives.ModalOverlay
> {}
const ModalOverlay = ({
  children,
  className,
  isDismissable = true,
  ...props
}: ModalOverlayProps) => {
  const { overlay } = modalVariants()
  return (
    <ModalPrimitives.ModalOverlay
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        overlay({ className }),
      )}
      {...props}
    >
      {children}
    </ModalPrimitives.ModalOverlay>
  )
}

interface ModalPanelProps extends React.ComponentProps<
  typeof ModalPrimitives.Modal
> {}
const ModalPanel = ({ children, className, ...props }: ModalPanelProps) => {
  const { modal } = modalVariants()
  return (
    <ModalPrimitives.Modal
      data-modal=""
      className={composeRenderProps(className, (className) =>
        modal({ className }),
      )}
      {...props}
    >
      {children}
    </ModalPrimitives.Modal>
  )
}

interface ModalBackdropProps extends React.ComponentProps<'div'> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
  const { backdrop } = modalVariants()
  return <div className={backdrop({ className })} {...props} />
}

interface ModalViewportProps extends React.ComponentProps<'div'> {}
const ModalViewport = ({ className, ...props }: ModalViewportProps) => {
  const { viewport } = modalVariants()
  return (
    <div
      data-slot="modal-viewport"
      className={viewport({ className })}
      {...props}
    />
  )
}

export type {
  ModalBackdropProps,
  ModalOverlayProps,
  ModalPanelProps,
  ModalProps,
  ModalViewportProps,
}
export { Modal, ModalBackdrop, ModalOverlay, ModalPanel, ModalViewport }
