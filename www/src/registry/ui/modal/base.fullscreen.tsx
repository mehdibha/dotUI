"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as ModalPrimitives from "react-aria-components/Modal"
import { useIsHidden } from "react-aria/private/collections/Hidden"

import { XIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { useStyles } from "./styles"

// MARK: modalStyles

// MARK: Separator

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
        <ModalPanel className={className}>
          {composeRenderProps(children, (children, { state }) => (
            <>
              {children}
              {/* No backdrop to tap below the mobile line: bring a close. */}
              {!hasCloseButton(children) && (
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Close"
                  onPress={state.close}
                  className="absolute top-2 right-2 md:hidden"
                >
                  <XIcon />
                </Button>
              )}
            </>
          ))}
        </ModalPanel>
      </ModalViewport>
    </ModalOverlay>
  )
}

const hasCloseButton = (children: React.ReactNode) =>
  React.isValidElement<{ showCloseButton?: boolean }>(children) &&
  children.props.showCloseButton === true

// MARK: Separator

interface ModalOverlayProps extends React.ComponentProps<
  typeof ModalPrimitives.ModalOverlay
> {}
const ModalOverlay = ({
  children,
  className,
  isDismissable = true,
  ...props
}: ModalOverlayProps) => {
  const { overlay } = useStyles()()
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

// MARK: Separator

interface ModalPanelProps extends React.ComponentProps<
  typeof ModalPrimitives.Modal
> {}
const ModalPanel = ({ children, className, ...props }: ModalPanelProps) => {
  const { modal } = useStyles()()
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

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
  const { backdrop } = useStyles()()
  return <div className={backdrop({ className })} {...props} />
}

interface ModalViewportProps extends React.ComponentProps<"div"> {}
const ModalViewport = ({ className, ...props }: ModalViewportProps) => {
  const { viewport } = useStyles()()
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
