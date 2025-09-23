"use client";

import { parseColor } from "react-aria-components";

import { ColorField } from "@dotui/ui/components/color-field";

export default function Demo() {
  return (
    <ColorField
      aria-label="Disabled color"
      value={parseColor("rgb(222,70,58)")}
      isDisabled
    />
  );
}
