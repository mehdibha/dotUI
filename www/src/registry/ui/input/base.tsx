"use client";

import React, { useCallback } from "react";
import { mergeProps, mergeRefs, useLayoutEffect } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import { chain } from "react-aria";
import {
	DateInput as AriaDateInput,
	DateSegment as AriaDateSegment,
	Group as AriaGroup,
	Input as AriaInput,
	InputContext as AriaInputContext,
	TextArea as AriaTextArea,
	TextAreaContext as AriaTextAreaContext,
	composeRenderProps,
	Provider,
	useContextProps,
} from "react-aria-components";
import type { DateInputProps as AriaDateInputProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "@/registry/lib/context";

import { dateInputStyles, useStyles } from "./styles";
import type { InputStyles } from "./styles";

// MARK: inputStyles

// MARK: InputGroupContext

const [InputGroupContext, useInputGroupContext] = createContext<boolean>({
	name: "InputGroupContext",
	strict: false,
});

// MARK: InputGroup

interface InputGroupProps extends React.ComponentProps<typeof AriaGroup>, Pick<VariantProps<InputStyles>, "size"> {}

const InputGroup = ({ className, children, size = "md", ...props }: InputGroupProps) => {
	const { group } = useStyles()();
	const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const [inputContextProps, mergedInputRef] = useContextProps(
		{},
		inputRef as React.RefObject<HTMLInputElement>,
		AriaInputContext,
	);
	const [textAreaContextProps, mergedTextAreaRef] = useContextProps(
		{},
		inputRef as React.RefObject<HTMLTextAreaElement>,
		AriaTextAreaContext,
	);
	const inputProps = { ...inputContextProps, ref: mergedInputRef };
	const textAreaProps = { ...textAreaContextProps, ref: mergedTextAreaRef };

	const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
		const target = event.target as HTMLElement;
		if (target.closest("input, button, a")) return;
		const input = inputRef.current;
		if (!input) return;
		requestAnimationFrame(() => {
			input.focus();
		});
	};

	return (
		<AriaGroup
			role="presentation"
			data-input-group=""
			data-slot="input-group"
			data-size={size}
			className={composeRenderProps(className, (className) => group({ size, className }))}
			{...mergeProps(props, { onPointerDown })}
		>
			{composeRenderProps(children, (children) => (
				<Provider
					values={[
						[AriaInputContext, inputProps],
						[AriaTextAreaContext, textAreaProps],
						[InputGroupContext, true],
					]}
				>
					{children}
				</Provider>
			))}
		</AriaGroup>
	);
};

// MARK: Input

interface InputProps
	extends Omit<React.ComponentProps<typeof AriaInput>, "size">,
		Pick<VariantProps<InputStyles>, "size"> {}

const Input = ({ size = "md", className, ...props }: InputProps) => {
	const { input } = useStyles()();
	const inGroup = useInputGroupContext("Input");
	return (
		<AriaInput
			data-slot="input"
			data-input=""
			data-in-group={inGroup || undefined}
			data-size={size}
			className={composeRenderProps(className, (className) => input({ className, inGroup, size }))}
			{...props}
		/>
	);
};

// MARK: TextArea

interface TextAreaProps
	extends Omit<React.ComponentProps<typeof AriaTextArea>, "size">,
		Pick<VariantProps<InputStyles>, "size"> {}

const TextArea = ({ ref, className, onChange, size = "md", ...props }: TextAreaProps) => {
	const { textArea } = useStyles()();
	const inGroup = useInputGroupContext("TextArea");
	const [inputValue, setInputValue] = useControlledState(props.value, props.defaultValue ?? "", () => {});
	const inputRef = React.useRef<HTMLTextAreaElement>(null);

	const onHeightChange = useCallback(() => {
		if (inputRef.current) {
			const input = inputRef.current;
			const prevAlignment = input.style.alignSelf;
			const prevOverflow = input.style.overflow;
			const prevFlex = input.style.flex; // Store the flex value

			const isFirefox = "MozAppearance" in input.style;
			if (!isFirefox) {
				input.style.overflow = "hidden";
			}
			input.style.flex = "none"; // Temporarily disable flex
			input.style.alignSelf = "start";
			input.style.height = "auto";
			// offsetHeight - clientHeight accounts for the border/padding.
			input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
			input.style.overflow = prevOverflow;
			input.style.alignSelf = prevAlignment;
			input.style.flex = prevFlex; // Restore the flex value
		}
	}, []);

	useLayoutEffect(() => {
		if (inputRef.current) {
			onHeightChange();
		}
	}, [onHeightChange, inputValue, inputRef]);

	return (
		<AriaTextArea
			ref={mergeRefs(inputRef, ref)}
			data-slot="textarea"
			data-in-group={inGroup || undefined}
			onChange={chain(onChange, setInputValue)}
			className={composeRenderProps(className, (className) => textArea({ className, inGroup }))}
			{...props}
		/>
	);
};

// MARK: InputAddon

interface InputAddonProps extends React.ComponentProps<"div"> {}

function InputAddon({ className, ...props }: InputAddonProps) {
	const { addon } = useStyles()();
	return <div role="group" data-slot="input-addon" className={addon({ className })} {...props} />;
}

// MARK: DateInput

interface DateInputProps extends Omit<AriaDateInputProps, "children">, Pick<VariantProps<InputStyles>, "size"> {
	children?: AriaDateInputProps["children"];
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
	const { input } = useStyles()();
	const inGroup = useInputGroupContext("DateInput");
	return (
		<AriaDateInput
			data-slot="date-input"
			data-date-input=""
			data-in-group={inGroup || undefined}
			className={composeRenderProps(className, (className) => input({ className, inGroup, size }))}
			{...props}
		>
			{props.children ? props.children : (segment) => <DateSegment segment={segment} />}
		</AriaDateInput>
	);
};

// MARK: DateSegment

interface DateSegmentProps extends React.ComponentProps<typeof AriaDateSegment> {}

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
	const { dateSegment } = dateInputStyles();
	return (
		<AriaDateSegment className={composeRenderProps(className, (className) => dateSegment({ className }))} {...props} />
	);
};

// MARK: exports

export type { DateInputProps, DateSegmentProps, InputAddonProps, InputGroupProps, InputProps, TextAreaProps };
export { DateInput, DateSegment, Input, InputAddon, InputGroup, TextArea };
