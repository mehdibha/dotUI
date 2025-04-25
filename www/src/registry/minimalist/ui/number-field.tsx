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
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { useIsMobile } from "@/registry/minimalist/hooks/use-is-mobile";
import { Button } from "@/registry/minimalist/ui/button_basic";
import {
  Label,
  HelpText,
  type FieldProps,
} from "@/registry/minimalist/ui/field_basic";
import {
  InputRoot,
  Input,
  type InputRootProps,
} from "@/registry/minimalist/ui/input_basic";

// TODO: update registry

const numberFieldStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
    inputRoot: "grid gap-0 px-0",
    input: "px-2 [grid-area:field]",
    increment: "w-8 p-0 [grid-area:increment]",
    decrement: "w-8 p-0 [grid-area:decrement]",
  },
  variants: {
    isMobile: {
      true: {
        inputRoot:
          "grid-cols-[auto_1fr_auto] [grid-template-areas:'decrement_field_increment']",
        increment: "h-full rounded-none rounded-r-md border-l",
        decrement: "h-full rounded-none rounded-l-md border-r",
      },
      false: {
        inputRoot:
          "grid-cols-[1fr_auto] [grid-template-areas:'field_increment''field_decrement']",
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
  const isMobile = useIsMobile();

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
  extends React.ComponentProps<typeof AriaNumberField> {
  placeholder?: string;
}
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
