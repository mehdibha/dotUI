import { createStyles } from "@/modules/core/styles";
import { fieldStyles } from "@/registry/ui/field/styles";

import otpFieldMeta from "./meta";

const { useStyles, styles } = createStyles(otpFieldMeta, {
	base: {
		slots: {
			root: [
				fieldStyles().field({ className: "group/otp-field" }),
				"**:data-input:w-9 **:data-input:flex-none **:data-input:px-0 **:data-input:text-center **:data-input:font-mono **:data-input:tabular-nums",
			],
			separator: "",
		},
	},
});

export type OTPFieldStyles = typeof styles;

export { styles as otpFieldStyles, useStyles };
