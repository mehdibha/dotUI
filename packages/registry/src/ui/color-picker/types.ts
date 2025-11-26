import type {
  ColorPickerProps as AriaColorPickerProps,
  ColorPickerState,
} from "react-aria-components";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type {
  DialogContentProps,
  DialogProps,
} from "@dotui/registry/ui/dialog";

export interface ColorPickerProps
  extends AriaColorPickerProps,
    Omit<DialogProps, "children"> {}

export interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode | ((props: ColorPickerState) => React.ReactNode);
}

export interface ColorPickerContentProps extends DialogContentProps {}

