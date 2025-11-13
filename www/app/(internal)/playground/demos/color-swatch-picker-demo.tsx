"use client";

import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@dotui/registry/ui/color-swatch-picker";

const colors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const themeColors = [
  "#1e293b",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f1f5f9",
  "#f8fafc",
];

export function ColorSwatchPickerDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-sm">Primary Colors</p>
        <ColorSwatchPicker>
          {colors.map((color) => (
            <ColorSwatchPickerItem key={color} color={color} />
          ))}
        </ColorSwatchPicker>
      </div>

      <div>
        <p className="mb-2 font-medium text-sm">Theme Colors</p>
        <ColorSwatchPicker>
          {themeColors.map((color) => (
            <ColorSwatchPickerItem key={color} color={color} />
          ))}
        </ColorSwatchPicker>
      </div>

      <div>
        <p className="mb-2 font-medium text-sm">With Disabled Items</p>
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ef4444" />
          <ColorSwatchPickerItem color="#f97316" isDisabled />
          <ColorSwatchPickerItem color="#f59e0b" />
          <ColorSwatchPickerItem color="#eab308" isDisabled />
          <ColorSwatchPickerItem color="#84cc16" />
        </ColorSwatchPicker>
      </div>

      <div>
        <p className="mb-2 font-medium text-sm">Different Sizes</p>
        <ColorSwatchPicker className="gap-2">
          {colors.slice(0, 8).map((color) => (
            <ColorSwatchPickerItem
              key={color}
              color={color}
              className="size-12"
            />
          ))}
        </ColorSwatchPicker>
      </div>
    </div>
  );
}
