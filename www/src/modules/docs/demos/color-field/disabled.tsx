"use client";

import { ColorField } from "@/components/dynamic-ui/color-field";
import { parseColor } from "react-aria-components";

export default function Demo() {
  return <ColorField value={parseColor("rgb(222,70,58)")} isDisabled />;
}
