"use client";

import React, { useCallback } from "react";
import { mergeProps, mergeRefs, useLayoutEffect } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import { chain } from "react-aria";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Group as AriaGroup,
  Input as AriaInput,
  InputContext as AriaInputContext,
  TextArea as AriaTextArea,
  TextAreaContext as AriaTextAreaContext,
  composeRenderProps,
  Provider,
  useContextProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { DateInputProps as AriaDateInputProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "../lib/utils";

const inputStyles = tv({
  slots: {
    group: [
      "group/input-group w-48 transition-[border-color,box-shadow]",
      "flex cursor-text items-center rounded-md border border-border-field bg-neutral text-base shadow-xs sm:text-sm",

      "gap-2 has-[>input]:px-3 has-[>input]:py-1 has-[>textarea]:py-2 has-[>textarea]:[&_[data-slot=input-addon]]:w-full has-[>textarea]:[&_[data-slot=input-addon]]:px-2",

      "has-[>textarea]:min-h-16 has-[>textarea]:flex-col has-[>textarea]:[&:not([class*='h-'])]:h-auto",

      // focus state
      // "focus-reset has-[[data-slot=input][data-focused]]:focus-input has-[[data-slot=textarea][data-focused]]:focus-input",
      "focus-reset focus-within:focus-input",

      // disabled state
      "has-[input[data-disabled]]:cursor-default has-[input[data-disabled]]:border-border-disabled has-[input[data-disabled]]:bg-disabled has-[input[data-disabled]]:text-fg-disabled",

      // invalid state
      "has-[input[data-invalid]]:border-border-danger focus-within:has-[input[data-invalid]]:border-border",
    ],
    addon: [
      "flex items-center gap-2 text-fg-muted",

      "[&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4",

      "first:group-has-[>input]/input-group:has-[>_[data-slot=button]]:ml-[-0.4375rem] last:group-has-[>input]/input-group:has-[>_[data-slot=button]]:mr-[-0.4375rem]",
      "first:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:ml-[-0.5625rem] last:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:mr-[-0.5625rem]",
      "first:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:ml-[-0.4375rem] last:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:mr-[-0.4375rem]",

      "[&_[data-slot=button]>svg:not([class*='size-'])]:size-3.5",

      "group-data-[size=sm]/input-group:[&_[data-slot=button]]:h-6 group-data-[size=sm]/input-group:[&_[data-slot=button][data-icon-only]]:w-6",
      "group-data-[size=lg]/input-group:[&_[data-slot=button]]:h-7 group-data-[size=lg]/input-group:[&_[data-slot=button][data-icon-only]]:w-7",
      "[&_[data-slot=button]]:h-6 [&_[data-slot=button][data-icon-only]]:w-6",

      "[&_[data-slot=button]]:px-2 [&_[data-slot=button]]:text-sm [&_[data-slot=button]]:has-[>svg]:px-2 [&_[data-slot=button]:not([class*='rounded-full'])]:rounded-sm [&_[data-slot=button]]:[&>svg:not([class*='size-'])]:size-3.5",

      "[&_[data-slot=button][data-icon-only]]:px-0",
    ],
    input: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
    textArea: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
  },
  variants: {
    size: {
      sm: {
        group: "has-[>input]:h-8",
      },
      md: {
        group: "has-[>input]:h-9",
      },
      lg: {
        group: "has-[>input]:h-10",
      },
    },
    inGroup: {
      true: {
        input: ["min-w-0 flex-1 bg-transparent outline-none"],
        textArea:
          "min-h-0 w-full resize-none rounded-none bg-transparent px-2 shadow-none outline-none",
      },
      false: {
        input: [
          "w-48 rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
          "text-base focus-reset transition-[border-color,box-shadow] data-[slot=date-input]:focus-within:focus-input data-[slot=input]:focus:focus-input sm:text-sm",
          "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
          "invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
          "data-[slot=date-input]:cursor-text"
        ],
        textArea: [
          "flex min-h-16 w-48 resize-none rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
          "text-base focus-reset transition-[border-color,box-shadow] focus:focus-input sm:text-sm",
          "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
          "invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
        ],
      },
    },
  },
  compoundVariants: [
    {
      inGroup: false,
      size: "sm",
      className: {
        input: "h-8",
      },
    },
    {
      inGroup: false,
      size: "md",
      className: {
        input: "h-9",
      },
    },
    {
      inGroup: false,
      size: "lg",
      className: {
        input: "h-10",
      },
    },
  ],
  defaultVariants: {
    size: "md",
    inGroup: false,
  },
});

const { group, input, textArea, addon } = inputStyles();

/* -----------------------------------------------------------------------------------------------*/

const [, useInputGroupContext, InputGroupContext] = createContext<boolean>({
  name: "InputGroupContext",
  strict: false,
});

/* -----------------------------------------------------------------------------------------------*/

interface InputGroupProps
  extends React.ComponentProps<typeof AriaGroup>,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const InputGroup = ({
  className,
  children,
  size = "md",
  ...props
}: InputGroupProps) => {
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [inputContextProps, mergedInputRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLInputElement>,
    AriaInputContext,
  );
  const [textAreaContextProps, mergedTextAreaRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLTextAreaElement>,
    AriaTextAreaContext,
  );
  const inputProps = { ...inputContextProps, ref: mergedInputRef };
  const textAreaProps = { ...textAreaContextProps, ref: mergedTextAreaRef };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, button, a")) return;
    const input = inputRef.current;
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus();
    });
  };

  return (
    <AriaGroup
      role="presentation"
      data-slot="input-group"
      data-size={size}
      className={composeRenderProps(className, (className) =>
        group({ size, className }),
      )}
      {...mergeProps(props, { onPointerDown })}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [AriaInputContext, inputProps],
            [AriaTextAreaContext, textAreaProps],
            [InputGroupContext, true],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaGroup>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface InputProps
  extends Omit<React.ComponentProps<typeof AriaInput>, "size">,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const Input = ({ size = "md", className, ...props }: InputProps) => {
  const inGroup = useInputGroupContext("Input");
  return (
    <AriaInput
      data-slot="input"
      data-in-group={inGroup || undefined}
      data-size={size}
      className={composeRenderProps(className, (className) =>
        input({ className, inGroup, size }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TextAreaProps
  extends Omit<React.ComponentProps<typeof AriaTextArea>, "size">,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const TextArea = ({
  ref,
  className,
  onChange,
  size = "md",
  ...props
}: TextAreaProps) => {
  const inGroup = useInputGroupContext("TextArea");
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? "",
    () => {},
  );
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const onHeightChange = useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      const prevAlignment = input.style.alignSelf;
      const prevOverflow = input.style.overflow;
      const prevFlex = input.style.flex; // Store the flex value

      const isFirefox = "MozAppearance" in input.style;
      if (!isFirefox) {
        input.style.overflow = "hidden";
      }
      input.style.flex = "none"; // Temporarily disable flex
      input.style.alignSelf = "start";
      input.style.height = "auto";
      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
      input.style.flex = prevFlex; // Restore the flex value
    }
  }, [inputRef]);

  useLayoutEffect(() => {
    if (inputRef.current) {
      onHeightChange();
    }
  }, [onHeightChange, inputValue, inputRef]);

  return (
    <AriaTextArea
      ref={mergeRefs(inputRef, ref)}
      data-slot="textarea"
      data-in-group={inGroup || undefined}
      onChange={chain(onChange, setInputValue)}
      className={composeRenderProps(className, (className) =>
        textArea({ className, inGroup }),
      )}
      {...props}
    />
  );
};

interface InputAddonProps extends React.ComponentProps<"div"> {}

function InputAddon({ className, ...props }: InputAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-addon"
      className={addon({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

const dateInputStyles = tv({
  slots: {
    dateSegment:
      "rounded px-0.5 outline-hidden select-none placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled type-literal:px-0",
  },
});

const { dateSegment } = dateInputStyles();

/* -----------------------------------------------------------------------------------------------*/

interface DateInputProps
  extends Omit<AriaDateInputProps, "children">,
    Pick<VariantProps<typeof inputStyles>, "size"> {
  children?: AriaDateInputProps["children"];
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
  const inGroup = useInputGroupContext("DateInput");
  return (
    <AriaDateInput
      data-slot="date-input"
      data-in-group={inGroup || undefined}
      className={composeRenderProps(className, (className) =>
        input({ className, inGroup, size }),
      )}
      {...props}
    >
      {props.children
        ? props.children
        : (segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DateSegmentProps
  extends React.ComponentProps<typeof AriaDateSegment> {}

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        dateSegment({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Input, TextArea, InputGroup, InputAddon, DateInput, DateSegment };

export type { InputGroupProps, InputProps, TextAreaProps };
