"use client";

import type * as React from "react";
import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as GroupPrimitives from "react-aria-components/Group";
import * as NumberFieldPrimitives from "react-aria-components/NumberField";

import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/field";
import { Input, inputStyles } from "@/components/ui/input";

interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

const NumberField = ({ className, ...props }: NumberFieldProps) => {
  const { field } = fieldStyles();
  return (
    <NumberFieldPrimitives.NumberField
      data-number-field=""
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <NumberFieldGroup>
              <Input />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          ),
      )}
    </NumberFieldPrimitives.NumberField>
  );
};

/* -------------------------------------------------------------------------- */

interface NumberFieldGroupProps extends React.ComponentProps<
  typeof GroupPrimitives.Group
> {
  size?: "sm" | "md" | "lg";
}

// Stepper cells at the end of the shell; parts are placed by slot.
const NumberFieldGroup = ({
  className,
  size,
  ...props
}: NumberFieldGroupProps) => {
  const { inputGroup } = inputStyles();
  return (
    <GroupPrimitives.Group
      data-number-field-group=""
      data-input-group=""
      data-size={size}
      className={composeRenderProps(className, (className) =>
        inputGroup({
          size,
          className: cn(
            "w-fit overflow-hidden pr-0",
            "*:[[slot=decrement]]:order-1 *:[[slot=increment]]:order-2",
            className,
          ),
        }),
      )}
      {...props}
    />
  );
};

interface NumberFieldStepperProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

const stepper =
  "flex shrink-0 cursor-interactive items-center justify-center self-stretch text-fg-muted outline-none transition-colors hover:bg-neutral-hover hover:text-fg pressed:bg-neutral-active disabled:cursor-disabled disabled:bg-transparent disabled:text-(--disabled-fg,currentColor) w-(--input-h) *:[svg]:size-(--icon-size)";

/* -------------------------------------------------------------------------- */

const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  return (
    <ButtonPrimitives.Button
      slot="decrement"
      className={composeRenderProps(className, (className) =>
        cn(stepper, className),
      )}
      {...props}
    >
      {children ?? <MinusIcon />}
    </ButtonPrimitives.Button>
  );
};

/* -------------------------------------------------------------------------- */

const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  return (
    <ButtonPrimitives.Button
      slot="increment"
      className={composeRenderProps(className, (className) =>
        cn(
          stepper,
          "relative before:absolute before:top-1/2 before:left-0 before:h-(--icon-size) before:w-px before:-translate-y-1/2 before:bg-border",
          className,
        ),
      )}
      {...props}
    >
      {children ?? <PlusIcon />}
    </ButtonPrimitives.Button>
  );
};

/* -------------------------------------------------------------------------- */

export type {
  NumberFieldGroupProps,
  NumberFieldProps,
  NumberFieldStepperProps,
};
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
};
