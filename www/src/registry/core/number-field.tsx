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
    inputRoot: "px-0 grid gap-0",
    input: "[grid-area:field] px-2",
    increment: "[grid-area:increment] w-8 p-0",
    decrement: "[grid-area:decrement] w-8 p-0",
  },
  variants: {
    isMobile: {
      true: {
        inputRoot: "[grid-template-areas:'decrement_field_increment'] grid-cols-[auto_1fr_auto]",
        increment: "h-full rounded-none rounded-r-md border-l",
        decrement: "h-full rounded-none rounded-l-md border-r",
      },
      false: {
        inputRoot: "[grid-template-areas:'field_increment''field_decrement'] grid-cols-[1fr_auto]",
        increment: "h-auto shrink rounded-none rounded-tr-md border-b border-l",
        decrement: "h-auto shrink rounded-none rounded-br-md border-l",
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
