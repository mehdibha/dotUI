"use client";

import type { Color } from "react-aria-components";
import React from "react";
import { ColorPicker } from "@/components/dynamic-ui/color-picker";
import { parseColor } from "react-aria-components";

export default function Demo() {
  const [value, setValue] = React.useState<Color>(
    parseColor("hsl(26, 33%, 78%)")
  );

  return <ColorPicker value={value} onChange={setValue} />;
}
