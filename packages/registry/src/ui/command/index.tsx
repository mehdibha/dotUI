"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Command as _Command, CommandRoot as _CommandRoot } from "./basic";

export const Command = createDynamicComponent(
  "command",
  "Command",
  _Command,
  {},
);

export const CommandRoot = createDynamicComponent(
  "command",
  "CommandRoot",
  _CommandRoot,
  {},
);
