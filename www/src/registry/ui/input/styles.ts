import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import inputMeta from "./meta";

const baseStyles = tv({
	slots: {
		inputGroup:
			"group/input-group cn-input-group relative flex w-full min-w-0 items-center rounded-(--input-radius) has-[>textarea]:h-auto",
		inputGroupAddon: "cn-input-group-addon flex cursor-text select-none items-center justify-center",
		input: "cn-input",
		textArea: "cn-text-area",
		dateInput: "cn-date-input",
		dateInputSegment: "cn-date-input-segment",
	},
	variants: {
		orientation: {
			horizontal: {
				inputGroup: "",
			},
			vertical: {
				inputGroup: "",
			},
		},
		size: {
			xs: {
				inputGroup: "cn-input-group-size-xs",
				input: "cn-input-size-xs",
				textArea: "cn-text-area-size-xs",
			},
			sm: {
				inputGroup: "cn-input-group-size-sm",
				input: "cn-input-size-sm",
				textArea: "cn-text-area-size-sm",
			},
			md: {
				inputGroup: "cn-input-group-size-md",
				input: "cn-input-size-md",
				textArea: "cn-text-area-size-md",
			},
			lg: {
				inputGroup: "cn-input-group-size-lg",
				input: "cn-input-size-lg",
				textArea: "cn-text-area-size-lg",
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const sousseStyles = tv({
	slots: {
		inputGroup: "border shadow-xs transition-[color,box-shadow]",
		inputGroupAddon: "",
		input: "",
		textArea: "",
		dateInput: "",
		dateInputSegment: "",
	},
	variants: {
		orientation: {
			horizontal: {},
			vertical: {},
		},
		size: {
			xs: {},
			sm: {},
			md: {},
			lg: {},
		},
	},
});

export type InputStyles = typeof baseStyles;

export const { useStyles } = createStyles(inputMeta, {
	default: sousseStyles,
});

// slots: {
// 	group: [
// 		"group/input-group transition-[border-color,box-shadow]",

// 		"flex cursor-text items-center rounded-md border border-border-field bg-neutral text-base shadow-xs sm:text-sm",

// 		"gap-2 has-[>input]:px-3 has-[>textarea]:px-2 has-[>input]:py-1 has-[>textarea]:py-2 has-[>textarea]:**:data-[slot=input-addon]:w-full",

// 		"has-[>textarea]:min-h-16 has-[>textarea]:flex-col has-[>textarea]:[&:not([class*='h-'])]:h-auto",

// 		// focus state
// 		// "focus-reset has-[[data-slot=input][data-focused]]:focus-input has-[[data-slot=textarea][data-focused]]:focus-input",
// 		"focus-reset focus-within:focus-input",

// 		// disabled state
// 		"has-[input[data-disabled]]:cursor-default has-[input[data-disabled]]:border-border-disabled has-[input[data-disabled]]:bg-disabled has-[input[data-disabled]]:text-fg-disabled",

// 		// invalid state
// 		"has-[input[data-invalid]]:border-border-danger focus-within:has-[input[data-invalid]]:border-border",
// 	],
// 	addon: [
// 		"flex items-center gap-2 text-fg-muted",

// 		"[&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4",

// 		"last:group-has-[>input]/input-group:has-[>_[data-slot=button]]:-mr-1.75 first:group-has-[>input]/input-group:has-[>_[data-slot=button]]:-ml-1.75",
// 		"last:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:-mr-2.25 first:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:-ml-2.25",
// 		"last:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:-mr-1.75 first:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:-ml-1.75",

// 		"[&_[data-slot=button]>svg:not([class*='size-'])]:size-3.5",

// 		"group-data-[size=sm]/input-group:**:data-[slot=button]:h-6 group-data-[size=sm]/input-group:[&_[data-slot=button][data-icon-only]]:w-6",
// 		"group-data-[size=lg]/input-group:**:data-[slot=button]:h-7 group-data-[size=lg]/input-group:[&_[data-slot=button][data-icon-only]]:w-7",
// 		"**:data-[slot=button]:h-6 [&_[data-slot=button][data-icon-only]]:w-6",

// 		"**:data-[slot=button]:px-2 **:data-[slot=button]:text-sm **:data-[slot=button]:has-[>svg]:px-2 [&_[data-slot=button]:not([class*='rounded-full'])]:rounded-sm [&_[data-slot=button]]:[&>svg:not([class*='size-'])]:size-3.5",

// 		"[&_[data-slot=button][data-icon-only]]:px-0",
// 	],
// 	input: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
// 	textArea: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
// },
// variants: {
// 	size: {
// 		sm: {
// 			group: "has-[>input]:h-8",
// 		},
// 		md: {
// 			group: "has-[>input]:h-9",
// 		},
// 		lg: {
// 			group: "has-[>input]:h-10",
// 		},
// 	},
// 	inGroup: {
// 		true: {
// 			input: ["min-w-0 flex-1 bg-transparent outline-none"],
// 			textArea: "min-h-0 resize-none rounded-none bg-transparent px-2 shadow-none outline-none",
// 		},
// 		false: {
// 			input: [
// 				"rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
// 				"focus-reset data-[slot=date-input]:focus-within:focus-input data-[slot=input]:focus:focus-input text-base transition-[border-color,box-shadow] sm:text-sm",
// 				"disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
// 				"invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
// 				"data-[slot=date-input]:cursor-text",
// 			],
// 			textArea: [
// 				"flex min-h-16 resize-none rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
// 				"focus-reset focus:focus-input text-base transition-[border-color,box-shadow] sm:text-sm",
// 				"disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
// 				"invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
// 			],
// 		},
// 	},
// },
// compoundVariants: [
// 	{
// 		inGroup: false,
// 		size: "sm",
// 		className: {
// 			input: "h-8",
// 		},
// 	},
// 	{
// 		inGroup: false,
// 		size: "md",
// 		className: {
// 			input: "h-9",
// 		},
// 	},
// 	{
// 		inGroup: false,
// 		size: "lg",
// 		className: {
// 			input: "h-10",
// 		},
// 	},
// ],
// defaultVariants: {
// 	size: "md",
// 	inGroup: false,
// },

// Date input styles

// const defaultDateInputStyles = tv({
// 	slots: {
// 		dateSegment:
// 			"select-none rounded px-0.5 type-literal:px-0 outline-hidden placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled",
// 	},
// });

// export type DateInputStyles = typeof defaultDateInputStyles;

// export const dateInputStyles = defaultDateInputStyles;
