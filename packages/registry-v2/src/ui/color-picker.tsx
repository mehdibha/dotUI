"use client";

import React from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerStateContext,
  composeRenderProps,
  getColorChannels,
} from "react-aria-components";
import type {
  ColorPickerProps as AriaColorPickerProps,
  Color,
  ColorFormat,
} from "react-aria-components";

import { cn } from "@dotui/registry-v2/lib/utils";
import { Button } from "@dotui/registry-v2/ui/button";
import { ColorArea } from "@dotui/registry-v2/ui/color-area";
import { ColorField } from "@dotui/registry-v2/ui/color-field";
import { ColorSlider } from "@dotui/registry-v2/ui/color-slider";
import { ColorSwatch } from "@dotui/registry-v2/ui/color-swatch";
import { Dialog, DialogContent } from "@dotui/registry-v2/ui/dialog";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry-v2/ui/select";
import type { ButtonProps } from "@dotui/registry-v2/ui/button";
import type {
  DialogProps,
  DialogRootProps,
} from "@dotui/registry-v2/ui/dialog";
import type { OverlayProps } from "@dotui/registry-v2/ui/overlay";

import { Input } from "./input";

interface ColorPickerProps
  extends Omit<ColorPickerRootProps, "children">,
    Omit<ColorPickerButtonProps, "value" | "type">,
    Pick<
      ColorPickerEditorProps,
      "showAlphaChannel" | "colorFormat" | "showFormatSelector"
    >,
    Pick<DialogProps, "defaultOpen" | "isOpen" | "onOpenChange">,
    Pick<OverlayProps, "type" | "mobileType"> {}
const ColorPicker = ({
  value,
  defaultValue,
  onChange,
  defaultOpen,
  isOpen,
  onOpenChange,
  children,
  colorFormat,
  showAlphaChannel,
  showFormatSelector,
  type,
  mobileType,
  ...props
}: ColorPickerProps) => {
  return (
    <ColorPickerRoot
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      <ColorPickerButton {...props}>{children}</ColorPickerButton>
      <ColorPickerOverlay type={type} mobileType={mobileType}>
        <DialogContent>
          <ColorPickerEditor
            showAlphaChannel={showAlphaChannel}
            colorFormat={colorFormat}
            showFormatSelector={showFormatSelector}
          />
        </DialogContent>
      </ColorPickerOverlay>
    </ColorPickerRoot>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerRootProps
  extends AriaColorPickerProps,
    Omit<DialogRootProps, "children"> {}

const ColorPickerRoot = ({
  defaultValue,
  value,
  onChange,
  children,
  ...props
}: ColorPickerRootProps) => {
  return (
    <AriaColorPicker>
      {composeRenderProps(children, (children) => (
        <Dialog {...props}>{children}</Dialog>
      ))}
    </AriaColorPicker>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode | ((color: Color) => React.ReactNode);
}

const ColorPickerTrigger = ({
  children,
  ...props
}: ColorPickerTriggerProps) => {
  const state = React.use(ColorPickerStateContext)!;
  return (
    <Button {...props}>
      {children ? (
        typeof children === "function" ? (
          children(state.color)
        ) : (
          children
        )
      ) : (
        <>
          <ColorSwatch />
          <span className="truncate text-left">{state.color.toString()}</span>
        </>
      )}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerButtonProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode;
  format?: ColorFormat | "css";
  showValue?: boolean;
}
const ColorPickerButton = ({
  children,
  format = "hex",
  showValue = true,
  ...props
}: ColorPickerButtonProps) => {
  const state = React.use(ColorPickerStateContext)!;
  return (
    <Button {...props}>
      {children || (
        <>
          <ColorSwatch />
          {showValue && (
            <span className="truncate text-left">
              {state.color.toString(format)}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

type ColorPickerOverlayProps = OverlayProps;

const ColorPickerOverlay = ({
  type = "popover",
  popoverProps,
  modalProps,
  ...props
}: ColorPickerOverlayProps) => {
  return (
    <Overlay
      type={type}
      popoverProps={{
        ...popoverProps,
        className: cn("w-[max-content]", popoverProps?.className),
      }}
      modalProps={{
        ...modalProps,
        className: cn("w-[max-content]", modalProps?.className),
      }}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

type ColorPickerColorFormat = "hex" | "rgb" | "hsl" | "hsb";
interface ColorPickerEditorProps extends React.ComponentProps<"div"> {
  colorFormat?: ColorPickerColorFormat;
  showAlphaChannel?: boolean;
  showFormatSelector?: boolean;
}
const ColorPickerEditor = ({
  colorFormat: ColorFormatProp = "hex",
  showAlphaChannel = false,
  showFormatSelector = true,
  className,
  ...props
}: ColorPickerEditorProps) => {
  const [colorFormat, setColorFormat] =
    React.useState<ColorPickerColorFormat>(ColorFormatProp);

  return (
    <div className={cn("mx-auto flex flex-col gap-2", className)} {...props}>
      <div className="flex gap-2">
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        />
        <ColorSlider
          defaultValue="#000000"
          orientation="vertical"
          colorSpace="hsb"
          channel="hue"
        />
        {showAlphaChannel && (
          <ColorSlider
            defaultValue="#000000"
            orientation="vertical"
            colorSpace="hsb"
            channel="alpha"
          />
        )}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          colorFormat === "hex" && "flex-row",
        )}
      >
        {showFormatSelector && (
          <Select
            aria-label="Color format"
            value={colorFormat}
            onChange={(key) => setColorFormat(key as ColorPickerColorFormat)}
            className="w-auto"
          >
            <SelectTrigger size="sm" />
            <SelectContent>
              <SelectItem id="hex">Hex</SelectItem>
              <SelectItem id="rgb">RGB</SelectItem>
              <SelectItem id="hsl">HSL</SelectItem>
              <SelectItem id="hsb">HSB</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex flex-1 items-center gap-2">
          {colorFormat === "hex" ? (
            <ColorField aria-label="Hex">
              <Input size="sm" className="w-10 flex-1" />
            </ColorField>
          ) : (
            getColorChannels(colorFormat).map((channel) => (
              <ColorField
                key={channel}
                colorSpace={colorFormat}
                channel={channel}
              >
                <Input size="sm" className="w-10 flex-1" />
              </ColorField>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundColorPicker = Object.assign(ColorPicker, {
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
  Button: ColorPickerButton,
  Overlay: ColorPickerOverlay,
  Content: DialogContent,
  Editor: ColorPickerEditor,
});

export type {
  ColorPickerColorFormat,
  ColorPickerRootProps,
  ColorPickerButtonProps,
  ColorPickerEditorProps,
};
export {
  CompoundColorPicker as ColorPicker,
  ColorPickerRoot,
  ColorPickerButton,
  ColorPickerEditor,
};
