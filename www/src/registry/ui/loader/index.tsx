import { createDynamicComponent } from "@/modules/core/styles";

import { Loader as RingLoader } from "./base.ring";
import { Loader as SpinnerLoader, type LoaderProps } from "./base.spinner";

const Loader = createDynamicComponent<LoaderProps, "spinner" | "ring">({
	componentName: "loader",
	paramName: "style",
	defaultValue: "spinner",
	components: {
		spinner: SpinnerLoader,
		ring: RingLoader,
	},
	displayName: "Loader",
});

export type { LoaderProps };
export { Loader };
