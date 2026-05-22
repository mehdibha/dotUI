import type { RegistryItem } from "@/registry/types";

const otpFieldMeta = {
	name: "otp-field",
	type: "registry:ui",
	group: "inputs",
	files: [
		{
			type: "registry:ui",
			path: "ui/otp-field/base.tsx",
			target: "ui/otp-field.tsx",
		},
	],
	dependencies: ["@base-ui/react"],
	registryDependencies: ["field", "group", "input"],
} satisfies RegistryItem;

export default otpFieldMeta;
