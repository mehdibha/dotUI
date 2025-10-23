"use client";

import React from "react";
import { useControlledState } from "@react-stately/utils";
import { chain, mergeProps } from "react-aria";
import {
  Input as UnstyledInput,
  TextField as UnstyledTextField,
} from "react-aria-components";
import type { TextFieldProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

export const AutoResizeTextField = ({
  onChange,
  className,
  inputRef,
  ...props
}: TextFieldProps & {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) => {
  const [_inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? "",
    () => {},
  );
  const localInputRef = React.useRef<HTMLInputElement>(null);

  const onWidthChange = React.useCallback(() => {
    if (localInputRef.current) {
      const input = localInputRef.current;
      input.style.width = "0";
      input.style.width = `${input.scrollWidth}px`;
    }
  }, []);

  React.useLayoutEffect(() => {
    if (localInputRef.current) {
      onWidthChange();
    }
  }, [onWidthChange]);

  return (
    <UnstyledTextField onChange={chain(onChange, setInputValue)} {...props}>
      <UnstyledInput
        {...mergeProps(
          {
            ref: localInputRef,
            className: cn(
              "min-w-[10px] border-fg focus:border-b focus:outline-none",
              className,
            ),
          },
          { ref: inputRef },
        )}
      />
    </UnstyledTextField>
  );
};
