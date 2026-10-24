import type { ReactNode } from "react"

import { illustrationsPart1 } from "./part-1"
import { illustrationsPart2 } from "./part-2"
import { illustrationsPart3 } from "./part-3"
import { illustrationsPart4 } from "./part-4"
import { illustrationsPart5 } from "./part-5"

// One schematic SVG per component slug, drawn to the shared spec in part-1.
export const componentIllustrations: Record<string, ReactNode> = {
  ...illustrationsPart1,
  ...illustrationsPart2,
  ...illustrationsPart3,
  ...illustrationsPart4,
  ...illustrationsPart5,
}
