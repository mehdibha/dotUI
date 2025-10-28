"use client";

import {
  ColorPicker as AriaColorPicker,
  composeRenderProps,
} from "react-aria-components";
import type { ColorPickerProps as AriaColorPickerProps } from "react-aria-components";

import { Dialog } from "@dotui/registry-v2/ui/dialog";
import type { DialogRootProps } from "@dotui/registry-v2/ui/dialog";

interface ColorPickerProps
  extends AriaColorPickerProps,
    Omit<DialogRootProps, "children"> {}

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

export { ColorPicker };
