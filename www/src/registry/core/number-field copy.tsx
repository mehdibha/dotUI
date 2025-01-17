"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import {
  NumberField as AriaNumberField,
  composeRenderProps,
  type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Button, type ButtonProps } from "@/registry/core/button-01";
import { Label, HelpText, type FieldProps } from "@/registry/core/field-01";
import { InputRoot, Input, type inputStyles } from "@/registry/core/input";
import { useMediaQuery } from "@/registry/hooks/use-media-query";
import { InputRootProps } from "./input_new";

const numberFieldStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
    inputRoot: "px-0 grid",
    input: "[grid-area:field]",
    increment: "[grid-area:increment]",
    decrement: "[grid-area:decrement]",
  },
  variants: {
    isMobile: {
      true: {
        increment: "",
        decrement: "",
      },
      false: {
        inputRoot: "[grid-template-areas:'field_increment''field_decrement'] grid-cols-[1fr_auto]",
        increment: "",
        decrement: "",
      },
    },
  },
});

const { root, inputRoot, input, increment, decrement } = numberFieldStyles();

interface NumberFieldProps
  extends NumberFieldRootProps,
    Pick<InputRootProps, "size">,
    FieldProps {}

const NumberField = ({
  label,
  description,
  errorMessage,
  size,
  ...props
}: NumberFieldProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <NumberFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot size={size} className={inputRoot({ isMobile })}>
        <Button slot="decrement" className={decrement({ isMobile })}>
          {isMobile ? <MinusIcon /> : <ChevronDownIcon />}
        </Button>
        <Input className={input()} />
        <Button slot="increment" className={increment({ isMobile })}>
          {isMobile ? <PlusIcon /> : <ChevronUpIcon />}
        </Button>
      </InputRoot>
      <HelpText description={description} errorMessage={errorMessage} />
    </NumberFieldRoot>
  );
};

interface NumberFieldRootProps
  extends React.ComponentProps<typeof AriaNumberField> {}
const NumberFieldRoot = ({ className, ...props }: NumberFieldRootProps) => {
  return (
    <AriaNumberField
      className={composeRenderProps(className, (className) =>
        root({ className })
      )}
      {...props}
    />
  );
};

export type { NumberFieldProps, NumberFieldRootProps };
export { NumberField, NumberFieldRoot };
