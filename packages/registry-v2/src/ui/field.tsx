"use client";

import React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  CheckboxContext,
  composeRenderProps,
  LabelContext,
  Provider,
  TextContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useSkeletonText } from "@dotui/registry-v2/ui/skeleton";
import { Text } from "@dotui/registry-v2/ui/text";

const fieldStyles = tv({
  slots: {
    fieldset: [
      "flex flex-col gap-6",
      "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
    ],
    legend: ["mb-3 text-base font-medium"],
    fieldGroup:
      "group/field-group @container/field-group flex w-full flex-col gap-7 has-data-[slot=checkbox]:gap-1.5 has-data-[slot=radio]:gap-1.5 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
    field: "flex items-start gap-2",
    fieldContent: "flex flex-col gap-1",
    label: [
      "inline-flex items-center gap-px text-sm leading-none text-fg peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
      // Required state
      "[[data-required]_&]:after:ml-0.5 [[data-required]_&]:after:text-fg-danger [[data-required]_&]:after:content-['*']",
      // Disabled state
      "[[data-disabled]_&]:cursor-not-allowed [[data-disabled]_&]:text-fg-disabled",
      // Invalid state
      "[[data-invalid]_&]:text-fg-danger",
    ],
    description: [
      "text-xs text-fg-muted",
      "[[data-disabled]_&]:text-fg-disabled",
    ],
    fieldError: "text-xs text-fg-danger",
  },
  variants: {
    orientation: {
      horizontal: {
        field:
          "flex-row items-center gap-2 has-data-[slot=description]:items-start",
      },
      vertical: {
        field: "flex-col gap-2",
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const {
  fieldset,
  legend,
  fieldGroup,
  field,
  fieldContent,
  label,
  description,
  fieldError,
} = fieldStyles();

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

interface LegendProps extends React.ComponentProps<"legend"> {}

function Legend({ className, ...props }: LegendProps) {
  return (
    <legend data-slot="legend" className={legend({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface FieldGroupProps extends React.ComponentProps<"div"> {}

function FieldGroup({ className, ...props }: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      className={fieldGroup({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldStyles> {}

const Field = ({ children, className, orientation, ...props }: FieldProps) => {
  const inputId = useSlotId();
  const descriptionId = useSlotId();
  return (
    <div
      data-slot="field"
      className={field({ className, orientation })}
      {...props}
    >
      <Provider
        values={[
          [
            CheckboxContext,
            {
              id: inputId,
              "aria-describedby": descriptionId,
            },
          ],
          [LabelContext, { htmlFor: inputId }],
          [TextContext, { slot: "description", id: descriptionId }],
        ]}
      >
        {children}
      </Provider>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface FieldContentProps extends React.ComponentProps<"div"> {}

const FieldContent = ({ className, ...props }: FieldContentProps) => {
  return (
    <div
      data-slot="field-content"
      className={fieldContent({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

const Label = ({ children, className, ...props }: LabelProps) => {
  children = useSkeletonText(children);
  return (
    <AriaLabel data-slot="label" className={label({ className })} {...props}>
      {children}
    </AriaLabel>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DescriptionProps
  extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

const Description = ({ className, ...props }: DescriptionProps) => {
  return (
    <Text
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

export {
  Fieldset,
  Legend,
  FieldGroup,
  Field,
  FieldContent,
  Label,
  Description,
  FieldError,
};

export { fieldStyles };

export type {
  FieldsetProps,
  LegendProps,
  LabelProps,
  FieldContentProps,
  DescriptionProps,
  FieldErrorProps,
};
