"use client";

import { parseColor } from "react-aria-components";
import { ColorField } from "@/registry/ui/default/core/color-field";

export default function Demo() {
  return <ColorField value={parseColor("rgb(222,70,58)")} isDisabled />;
}
