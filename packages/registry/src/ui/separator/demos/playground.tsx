"use client";

import type { Control } from "@dotui/registry/playground";

import { Separator } from "../index";

interface SeparatorPlaygroundProps {
  orientation?: "horizontal" | "vertical";
}

export function SeparatorPlayground({
  orientation = "horizontal",
}: SeparatorPlaygroundProps) {
  return (
    <div
      className={
        orientation === "vertical" ? "flex h-20 items-center" : "w-full"
      }
    >
      <Separator orientation={orientation} />
    </div>
  );
}

export const separatorControls: Control[] = [
  {
    type: "enum",
    name: "orientation",
    label: "Orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
];
