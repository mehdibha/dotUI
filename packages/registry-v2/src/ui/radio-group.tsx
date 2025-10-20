"use client";

import * as React from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { focusRing } from "@dotui/registry-v2/lib/focus-styles";

const radioGroupStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    wrapper: "flex gap-1",
    content: "",
  },
  variants: {
    orientation: {
      horizontal: {
        wrapper: "flex-row gap-2",
      },
      vertical: {
        wrapper: "flex-col",
      },
    },
  },
});

const { root: radioGroup } = radioGroupStyles();

interface RadioGroupProps extends React.ComponentProps<typeof AriaRadioGroup> {}

const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return (
    <AriaRadioGroup
      className={composeRenderProps(className, (className, { orientation }) =>
        radioGroup({ className, orientation }),
      )}
      {...props}
    />
  );
};

const radioStyles = tv({
  slots: {
    root: "group flex cursor-pointer flex-row items-center gap-2 invalid:text-fg-danger disabled:cursor-default disabled:text-fg-disabled",
    indicator: [
      focusRing(),
      "relative size-4 shrink-0 rounded-full border border-border-control transition-all duration-100 group-selected:border-4 group-selected:border-primary",
      "group-disabled:border-border-disabled indeterminate:group-disabled:bg-disabled selected:group-disabled:bg-disabled",
      "group-invalid:border-border-danger group-invalid:selected:border-danger",
    ],
  },
});

const { root, indicator } = radioStyles();

/* -----------------------------------------------------------------------------------------------*/

interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

const Radio = ({ className, ...props }: RadioProps) => {
  return (
    <AriaRadio
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
  return <div className={indicator({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundRadio = Object.assign(Radio, {
  Indicator: RadioIndicator,
});

export { RadioGroup, CompoundRadio as Radio };

export type { RadioGroupProps, RadioProps, RadioIndicatorProps };
