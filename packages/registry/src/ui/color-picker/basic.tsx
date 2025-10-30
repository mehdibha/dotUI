"use client";

import { useContext } from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerStateContext as AriaColorPickerStateContext,
  composeRenderProps,
} from "react-aria-components";
import type {
  ColorPickerProps as AriaColorPickerProps,
  ColorPickerState,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type {
  DialogContentProps,
  DialogProps,
} from "@dotui/registry/ui/dialog";

interface ColorPickerProps
  extends AriaColorPickerProps,
    Omit<DialogProps, "children"> {}

const ColorPicker = ({
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: ColorPickerProps) => {
  return (
    <AriaColorPicker {...props}>
      {composeRenderProps(props.children, (children) => (
        <Dialog
          defaultOpen={defaultOpen}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Dialog>
      ))}
    </AriaColorPicker>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode | ((props: ColorPickerState) => React.ReactNode);
}

const ColorPickerTrigger = ({
  children,
  ...props
}: ColorPickerTriggerProps) => {
  const state = useContext(AriaColorPickerStateContext)!;
  return (
    <Button {...props}>
      {children ? (
        typeof children === "function" ? (
          children(state)
        ) : (
          children
        )
      ) : (
        <>
          <ColorSwatch />
          <span className="truncate">{state.color.toString()}</span>
        </>
      )}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerContentProps extends DialogContentProps {}
const ColorPickerContent = ({
  children,
  ...props
}: ColorPickerContentProps) => {
  return (
    <Overlay type="popover">
      <DialogContent {...props}>{children}</DialogContent>
    </Overlay>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorPicker, ColorPickerTrigger, ColorPickerContent };
export type {
  ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerContentProps,
};
