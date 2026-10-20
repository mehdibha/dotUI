"use client"

import * as React from "react"
import { ButtonContext } from "react-aria-components/Button"
import * as ColorPickerPrimitives from "react-aria-components/ColorPicker"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { DEFAULT_SLOT, Provider } from "react-aria-components/slots"

import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Dialog } from "@/registry/ui/dialog"
import type { DialogProps } from "@/registry/ui/dialog"

interface ColorPickerProps
  extends
    ColorPickerPrimitives.ColorPickerProps,
    Omit<DialogProps, "children"> {}

const ColorPicker = ({
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: ColorPickerProps) => {
  return (
    <ColorPickerPrimitives.ColorPicker {...props}>
      {composeRenderProps(props.children, (children) => (
        <Dialog
          defaultOpen={defaultOpen}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ColorPickerInner>{children}</ColorPickerInner>
        </Dialog>
      ))}
    </ColorPickerPrimitives.ColorPicker>
  )
}

const ColorPickerInner = ({ children }: { children: React.ReactNode }) => {
  const buttonContext = React.useContext(ButtonContext)
  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            slots: {
              [DEFAULT_SLOT]: {
                ...buttonContext,
                children: <ColorSwatch />,
              },
            },
          },
        ],
      ]}
    >
      {children}
    </Provider>
  )
}

// MARK: Separator

export type { ColorPickerProps }
export { ColorPicker }
