export type TokenOption = {
	label: string;
	value: string;
};

export const RADIUS_OPTIONS: readonly TokenOption[] = [
	{ label: "none", value: "0" },
	{ label: "sm", value: "--radius-sm" },
	{ label: "md", value: "--radius-md" },
	{ label: "lg", value: "--radius-lg" },
	{ label: "xl", value: "--radius-xl" },
	{ label: "2xl", value: "--radius-2xl" },
	{ label: "full", value: "--radius-full" },
] as const;

export const BLUR_OPTIONS: readonly TokenOption[] = [
	{ label: "None", value: "0px" },
	{ label: "Extra Small", value: "--blur-xs" },
	{ label: "Small", value: "--blur-sm" },
	{ label: "Medium", value: "--blur-md" },
	{ label: "Large", value: "--blur-lg" },
	{ label: "Extra Large", value: "--blur-xl" },
] as const;

export const OPACITY_OPTIONS: readonly TokenOption[] = [
	{ label: "20%", value: "20%" },
	{ label: "40%", value: "40%" },
	{ label: "60%", value: "60%" },
	{ label: "80%", value: "80%" },
] as const;

export const SHADOW_OPTIONS: readonly TokenOption[] = [
	{ label: "None", value: "none" },
	{ label: "Extra Small", value: "--shadow-xs" },
	{ label: "Small", value: "--shadow-sm" },
	{ label: "Medium", value: "--shadow-md" },
	{ label: "Large", value: "--shadow-lg" },
	{ label: "Extra Large", value: "--shadow-xl" },
	{ label: "2XL", value: "--shadow-2xl" },
	{ label: "Shine", value: "--shadow-shine" },
] as const;

export const CURSOR_OPTIONS: readonly TokenOption[] = [
	{ label: "Interactive", value: "--cursor-interactive" },
	{ label: "Disabled", value: "--cursor-disabled" },
	{ label: "Default", value: "default" },
	{ label: "Pointer", value: "pointer" },
	{ label: "Grab", value: "grab" },
	{ label: "Grabbing", value: "grabbing" },
	{ label: "Not allowed", value: "not-allowed" },
	{ label: "Wait", value: "wait" },
	{ label: "Help", value: "help" },
	{ label: "Crosshair", value: "crosshair" },
	{ label: "Text", value: "text" },
	{ label: "Move", value: "move" },
	{ label: "Progress", value: "progress" },
] as const;
