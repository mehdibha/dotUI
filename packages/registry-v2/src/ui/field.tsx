"use client";

import React from "react";
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  Text as AriaText,
  composeRenderProps,
  FieldErrorContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const fieldStyles = tv({
  slots: {
    fieldset: "",
    legend: [
      "mb-3 font-medium",
      "data-[variant=legend]:text-base",
      "data-[variant=label]:text-sm",
    ],
    group:
      "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
    label: [
      "inline-flex items-center gap-px text-sm leading-none text-fg-muted peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
      // Required state
      "[[data-required]_&]:after:ml-0.5 [[data-required]_&]:after:text-fg-danger [[data-required]_&]:after:content-['*']",
      // Disabled state
      "[[data-disabled]_&]:cursor-not-allowed [[data-disabled]_&]:text-fg-disabled",
      // Invalid state
      "[[data-invalid]_&]:text-fg-danger",
    ],
    description: "text-xs text-fg-muted",
    fieldError: "text-xs text-fg-danger",
  },
});

const { fieldset, label, description, fieldError } = fieldStyles();

/* -----------------------------------------------------------------------------------------------*/

interface FieldsetProps extends React.ComponentProps<"fieldset"> {}

function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <fieldset
      data-slot="fieldset"
      className={fieldset({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

const Label = ({ className, ...props }: LabelProps) => {
  return (
    <AriaLabel data-slot="label" className={label({ className })} {...props} />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}

const Description = ({ className, ...props }: DescriptionProps) => {
  return (
    <AriaText
      data-slot="description"
      slot="description"
      className={description({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface FieldErrorProps extends React.ComponentProps<typeof AriaFieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      data-slot="field-error"
      className={composeRenderProps(className, (className) =>
        fieldError({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Fieldset, Label, Description, FieldError };

export type { FieldsetProps, LabelProps, DescriptionProps, FieldErrorProps };
