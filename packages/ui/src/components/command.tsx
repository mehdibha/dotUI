"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Command as _Command,
  CommandRoot as _CommandRoot,
} from "../registry/components/command/basic";

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
