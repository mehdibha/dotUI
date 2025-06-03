"use client";

import type { Color } from "react-aria-components";
import React from "react";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/dynamic-ui/color-swatch-picker";
import { parseColor } from "react-aria-components";

export default function Demo() {
  const [value, setValue] = React.useState<Color>(parseColor("#f80"));
  return (
    <ColorSwatchPicker defaultValue="#fff" value={value} onChange={setValue}>
      <ColorSwatchPickerItem color="#fff" />
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#f80" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#08f" />
      <ColorSwatchPickerItem color="#088" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  );
}
