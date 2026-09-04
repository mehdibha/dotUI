import { parseColor } from "react-aria-components/ColorArea"

import { ColorArea } from "@/registry/ui/color-area"

export function ColorAreaDemo() {
  return <ColorArea defaultValue={parseColor("hsl(0, 80%, 55%)")} />
}
