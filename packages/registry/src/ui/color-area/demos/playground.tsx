"use client";

import type { Control } from "@dotui/registry/playground";

import { ColorArea } from "../index";

interface ColorAreaPlaygroundProps {
  isDisabled?: boolean;
}

export function ColorAreaPlayground({
  isDisabled = false,
}: ColorAreaPlaygroundProps) {
  return <ColorArea defaultValue="#ff0000" isDisabled={isDisabled} />;
}

export const colorAreaControls: Control[] = [
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
];
