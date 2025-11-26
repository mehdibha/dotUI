"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";
import {
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";

import * as Default from "./basic";
import type {
  CommandContentProps,
  CommandInputProps,
  CommandProps,
} from "./types";

export const Command = createDynamicComponent<CommandProps>(
  "command",
  "Command",
  Default.Command,
  {},
);

export const CommandContent = <T extends object = object>(
  props: CommandContentProps<T>,
) => {
  const Component = createDynamicComponent<CommandContentProps<T>>(
    "command",
    "CommandContent",
    Default.CommandContent,
    {},
  );
  return <Component {...props} />;
};

export const CommandInput = (props: CommandInputProps) => {
  const Component = createDynamicComponent<CommandInputProps>(
    "command",
    "CommandInput",
    Default.CommandInput,
    {},
  );
  return <Component {...props} />;
};

export {
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
};

export type { CommandContentProps, CommandInputProps, CommandProps };
