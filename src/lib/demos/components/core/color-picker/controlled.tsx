"use client";

import React from "react";
import { ColorPicker } from "@/lib/components/core/default/color-picker";

export default function Demo() {
  const [value, setValue] = React.useState<string>("hsl(25, 100%, 50%)");
  return <ColorPicker value={value} onChange={(color) => setValue(color.toString())} />;
}
