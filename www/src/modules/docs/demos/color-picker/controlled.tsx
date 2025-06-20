"use client";

import type { Color } from "react-aria-components";
import React from "react";
import { parseColor } from "react-aria-components";

import { ColorPicker } from "@dotui/ui/components/color-picker";

export default function Demo() {
  const [value, setValue] = React.useState<Color>(
    parseColor("hsl(26, 33%, 78%)"),
  );

  return <ColorPicker value={value} onChange={setValue} />;
}
