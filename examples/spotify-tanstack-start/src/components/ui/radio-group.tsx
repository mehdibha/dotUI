"use client";

import { createContext, useContext, useId } from "react";
import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { LabelContext } from "react-aria-components/Label";
import * as RadioGroupPrimitives from "react-aria-components/RadioGroup";
import { Provider, useSlottedContext } from "react-aria-components/slots";
import { useSlotId } from "react-aria/private/utils/useId";

import { Label } from "@/components/ui/field";
import { tv } from "tailwind-variants";

const radioGroupVariants = tv({
  slots: {
    group: "flex flex-col gap-3",
    root: "flex items-center has-data-description:items-start gap-2",
    control:
      "relative flex items-center gap-2 rounded-full focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-lg transition-colors duration-75 has-data-label:w-full has-data-label:border has-data-label:p-2.5 has-data-label:selected:border-selection/25 has-data-label:selected:bg-selection-muted",
    indicator:
      "grid size-4 shrink-0 place-content-center rounded-full border border-border-control bg-transparent text-transparent before:size-1.5 before:rounded-full before:bg-current before:content-[''] transition-[background-color,border-color,box-shadow,color] duration-75 selected:border-transparent selected:bg-selection selected:text-fg-on-selection disabled:border-(--disabled-border,var(--color-border-control)) disabled:selected:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selection)) invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-danger",
  },
});
const { group, root, control, indicator } = radioGroupVariants();

const RadioGroup = ({
  className,
  ...props
}: RadioGroupPrimitives.RadioGroupProps) => {
  return (
    <RadioGroupPrimitives.RadioGroup
      data-field=""
      className={composeRenderProps(className, (className) =>
        group({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

const InternalRadioContext =
  createContext<RadioGroupPrimitives.RadioButtonRenderProps | null>(null);

interface RadioProps extends React.ComponentProps<
  typeof RadioGroupPrimitives.RadioField
> {}

const Radio = ({ id: idProp, className, ...props }: RadioProps) => {
  const autoId = useId();
  const id = idProp ?? autoId;
  const labelId = useSlotId();
  return (
    <RadioGroupPrimitives.RadioField
      data-slot="radio"
      data-radio=""
      id={id}
      aria-labelledby={labelId}
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => {
        return children ? (
          <Provider values={[[LabelContext, { htmlFor: id, id: labelId }]]}>
            {typeof children === "string" ? (
              <>
                <RadioControl />
                <Label>{children}</Label>
              </>
            ) : (
              children
            )}
          </Provider>
        ) : (
          <RadioControl />
        );
      })}
    </RadioGroupPrimitives.RadioField>
  );
};

interface RadioControlProps extends React.ComponentProps<
  typeof RadioGroupPrimitives.RadioButton
> {}

const RadioControl = ({ className, ...props }: RadioControlProps) => {
  const labelContext = useSlottedContext(LabelContext);
  const { id: labelId } = labelContext ?? {};
  return (
    <RadioGroupPrimitives.RadioButton
      data-radio-control=""
      className={composeRenderProps(className, (className) =>
        control({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return (
          <Provider
            values={[
              [InternalRadioContext, renderProps],
              [LabelContext, { id: labelId, elementType: "span" }],
            ]}
          >
            {children ?? <RadioIndicator />}
          </Provider>
        );
      })}
    </RadioGroupPrimitives.RadioButton>
  );
};

interface RadioIndicatorProps extends React.ComponentProps<"span"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
  const ctx = useContext(InternalRadioContext);
  return (
    <span
      data-radio-indicator=""
      data-rac=""
      data-selected={ctx?.isSelected || undefined}
      data-pressed={ctx?.isPressed || undefined}
      data-hovered={ctx?.isHovered || undefined}
      data-focused={ctx?.isFocused || undefined}
      data-focus-visible={ctx?.isFocusVisible || undefined}
      data-disabled={ctx?.isDisabled || undefined}
      data-readonly={ctx?.isReadOnly || undefined}
      data-invalid={ctx?.isInvalid || undefined}
      data-required={ctx?.isRequired || undefined}
      className={indicator({ className })}
      {...props}
    >
      <span />
    </span>
  );
};

/* -------------------------------------------------------------------------- */

type RadioGroupProps = RadioGroupPrimitives.RadioGroupProps;

export type {
  RadioControlProps,
  RadioGroupProps,
  RadioIndicatorProps,
  RadioProps,
};
export { Radio, RadioControl, RadioGroup, RadioIndicator };
