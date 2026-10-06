"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as ModalPrimitives from "react-aria-components/Modal"
import { useIsHidden } from "react-aria/private/collections/Hidden"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Drawer } from "@/registry/ui/drawer"

import { useStyles } from "./styles"

// MARK: modalStyles

// MARK: Separator

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => {
  const isHidden = useIsHidden()
  const isMobile = useIsMobile()

  if (isHidden) {
    return <>{children}</>
  }

  // Below the mobile line the dialog slides up in a bottom drawer; an alert
  // dialog stays centered, and only a dismissable one swipes away.
  if (isMobile && typeof children !== "function" && !isAlertDialog(children)) {
    return (
      <Drawer
        isOpen={props.isOpen}
        defaultOpen={props.defaultOpen}
        onOpenChange={props.onOpenChange}
        isDismissable={props.isDismissable}
        isKeyboardDismissDisabled={props.isKeyboardDismissDisabled}
        swipeToDismiss={props.isDismissable !== false}
        className={typeof className === "string" ? className : undefined}
      >
        {children}
      </Drawer>
    )
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

const isAlertDialog = (children: React.ReactNode) =>
  React.isValidElement<{ role?: string }>(children) &&
  children.props.role === "alertdialog"

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
