import { createDynamicComponent } from "@/lib/styles"

import { Loader as BladesLoader } from "./base.blades"
import { Loader as DotsLoader } from "./base.dots"
import { type LoaderProps, Loader as RingLoader } from "./base.ring"

const Loader = createDynamicComponent<LoaderProps, "ring" | "blades" | "dots">({
  componentName: "loader",
  paramName: "style",
  defaultValue: "ring",
  components: {
    ring: RingLoader,
    blades: BladesLoader,
    dots: DotsLoader,
  },
  displayName: "Loader",
})

export type { LoaderProps }
export { Loader }
