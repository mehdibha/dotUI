import { createDynamicComponent } from "@/lib/styles"

import { Loader as BladesLoader } from "./base.blades"
import { Loader as DotsLoader } from "./base.dots"
import { type LoaderProps, Loader as RingLoader } from "./base.ring"
import { Loader as RingTrackLoader } from "./base.ring-track"
import meta from "./meta"

const Loader = createDynamicComponent({
  meta,
  paramName: "style",
  components: {
    ring: RingLoader,
    "ring-track": RingTrackLoader,
    blades: BladesLoader,
    dots: DotsLoader,
  },
  displayName: "Loader",
})

export type { LoaderProps }
export { Loader }
