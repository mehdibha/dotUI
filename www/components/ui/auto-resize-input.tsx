"use client";

import React from "react";
import { chain, mergeRefs } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  Input as UnstyledInput,
  TextField as UnstyledTextField,
} from "react-aria-components";
import type { TextFieldProps } from "react-aria-components";

import { cn } from "@dotui/ui/lib/utils";

export const AutoResizeTextField = ({
  onChange,
  className,
  inputRef,
  ...props
}: TextFieldProps & {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) => {
  const [inputValue, setInputValue] = useControlledState(
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
  }, [localInputRef]);

  React.useLayoutEffect(() => {
    if (localInputRef.current) {
      onWidthChange();
    }
  }, [onWidthChange, inputValue, localInputRef]);

  return (
    <UnstyledTextField onChange={chain(onChange, setInputValue)} {...props}>
      <UnstyledInput
        ref={mergeRefs(localInputRef, inputRef)}
        className={cn(
          "border-fg min-w-[10px] focus:border-b focus:outline-none",
          className,
        )}
      />
    </UnstyledTextField>
  );
};
