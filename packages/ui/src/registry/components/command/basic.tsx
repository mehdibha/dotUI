"use client";

import React from "react";
import { Autocomplete as AriaAutocomplete } from "react-aria-components";
import { tv } from "tailwind-variants";

const commandStyles = tv({
  slots: {
    root: "flex flex-col",
  },
  variants: {
    standalone: {
      true: {
        root: "",
      },
    },
  },
  defaultVariants: {
    standalone: true,
  },
});

const { root } = commandStyles();

interface CommandProps extends CommandRootProps {}
const Command = (props: CommandProps) => {
  return <CommandRoot {...props} />;
};

interface CommandRootProps
  extends React.ComponentProps<typeof AriaAutocomplete>,
    Omit<React.ComponentProps<"div">, "children" | "slot"> {}
const CommandRoot = ({
  filter,
  defaultInputValue,
  inputValue,
  onInputChange,
  slot,
  className,
  ...props
}: CommandProps) => {
  return (
    <AriaAutocomplete
      filter={filter}
      defaultInputValue={defaultInputValue}
      inputValue={inputValue}
      onInputChange={onInputChange}
      slot={slot}
    >
      <div className={root({ className })} {...props} />
    </AriaAutocomplete>
  );
};

export { Command, CommandRoot };
