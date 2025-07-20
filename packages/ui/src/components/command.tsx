"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Command as _Command,
  CommandRoot as _CommandRoot,
} from "../registry/components/command/basic";

export const Command = createDynamicComponent("command", "Command", _Command, {
  basic: React.lazy(() =>
    import("../registry/components/command/basic").then((mod) => ({
      default: mod.Command,
    })),
  ),
});

export const CommandRoot = createDynamicComponent(
  "command",
  "CommandRoot",
  _CommandRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/command/basic").then((mod) => ({
        default: mod.CommandRoot,
      })),
    ),
  },
);
