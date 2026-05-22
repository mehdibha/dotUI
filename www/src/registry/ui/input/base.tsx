"use client";

import React, { useCallback } from "react";

import { chain } from "react-aria";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitive from "react-aria-components/DateField";
import * as GroupPrimitive from "react-aria-components/Group";
import * as InputPrimitive from "react-aria-components/Input";
import * as TextAreaPrimitive from "react-aria-components/TextArea";
import { mergeRefs } from "react-aria/mergeRefs";
import { getEventTarget } from "react-aria/private/utils/shadowdom/DOMFunctions";
import { useLayoutEffect } from "react-aria/private/utils/useLayoutEffect";
import { useControlledState } from "react-stately/useControlledState";

import type { VariantProps } from "tailwind-variants";

import { type InputStyles, useStyles } from "./styles";

// MARK: Separator

interface InputGroupProps extends React.ComponentProps<typeof GroupPrimitive.Group>, VariantProps<InputStyles> {}

const INTERACTIVE_SELECTOR = "button,input,textarea,[role='button']";

const focusInnerInput = (group: HTMLElement) => {
	(group.querySelector("input, textarea") as HTMLElement | null)?.focus();
};

const InputGroup = ({ className, size, onPointerDown, onTouchEnd, ...props }: InputGroupProps) => {
	const { inputGroup } = useStyles()();
	return (
		<GroupPrimitive.Group
			data-input-group=""
			data-size={size}
			onPointerDown={(e) => {
				onPointerDown?.(e);
				if (e.defaultPrevented || e.pointerType !== "mouse") return;
				const target = getEventTarget(e) as Element;
				if (target.closest(INTERACTIVE_SELECTOR)) return;
				e.preventDefault();
				focusInnerInput(e.currentTarget);
			}}
			onTouchEnd={(e) => {
				onTouchEnd?.(e);
				if (e.defaultPrevented) return;
				const target = getEventTarget(e) as HTMLElement;
				if (target.isContentEditable || target.closest(INTERACTIVE_SELECTOR)) return;
				e.preventDefault();
				focusInnerInput(e.currentTarget);
			}}
			className={composeRenderProps(className, (className) => inputGroup({ className, size }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface InputProps
	extends Omit<React.ComponentProps<typeof InputPrimitive.Input>, "size">, VariantProps<InputStyles> {}

const Input = ({ className, size, ...props }: InputProps) => {
	const { input } = useStyles()();
	return (
		<InputPrimitive.Input
			data-input=""
			data-size={size}
			data-input-control=""
			className={composeRenderProps(className, (className) => input({ className, size }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface TextAreaProps extends React.ComponentProps<typeof TextAreaPrimitive.TextArea> {}

const TextArea = ({ ref, className, onChange, ...props }: TextAreaProps) => {
	const { textArea } = useStyles()();
	const [inputValue, setInputValue] = useControlledState(props.value, props.defaultValue ?? "", () => {});
	const inputRef = React.useRef<HTMLTextAreaElement>(null);

	const onHeightChange = useCallback(() => {
		if (inputRef.current) {
			const input = inputRef.current;
			const prevAlignment = input.style.alignSelf;
			const prevOverflow = input.style.overflow;
			const prevFlex = input.style.flex;

			const isFirefox = "MozAppearance" in input.style;
			if (!isFirefox) {
				input.style.overflow = "hidden";
			}
			input.style.flex = "none";
			input.style.alignSelf = "start";
			input.style.height = "auto";
			input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
			input.style.overflow = prevOverflow;
			input.style.alignSelf = prevAlignment;
			input.style.flex = prevFlex;
		}
	}, []);

	useLayoutEffect(() => {
		if (inputRef.current) {
			onHeightChange();
		}
	}, [onHeightChange, inputValue, inputRef]);

	return (
		<TextAreaPrimitive.TextArea
			ref={mergeRefs(inputRef, ref as React.RefObject<HTMLTextAreaElement | null>)}
			data-textarea=""
			data-input-control=""
			onChange={chain(onChange, setInputValue)}
			className={composeRenderProps(className, (className) => textArea({ className }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface InputGroupAddonProps extends React.ComponentProps<"div"> {}

function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
	const { inputGroupAddon } = useStyles()();
	return <div data-input-group-addon="" className={inputGroupAddon({ className })} {...props} />;
}

// MARK: Separator

interface DateInputProps extends Omit<DateFieldPrimitive.DateInputProps, "children">, VariantProps<InputStyles> {
	children?: DateFieldPrimitive.DateInputProps["children"];
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
	const { input } = useStyles()();
	return (
		<DateFieldPrimitive.DateInput
			data-input=""
			data-date-input=""
			data-input-control=""
			data-size={size}
			className={composeRenderProps(className, (className) => input({ className, size }))}
			{...props}
		>
			{(segment) => <DateSegment segment={segment} />}
		</DateFieldPrimitive.DateInput>
	);
};

// MARK: Separator

interface DateSegmentProps extends React.ComponentProps<typeof DateFieldPrimitive.DateSegment> {}

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
	const { dateInputSegment } = useStyles()();
	return (
		<DateFieldPrimitive.DateSegment
			className={composeRenderProps(className, (className) => dateInputSegment({ className }))}
			{...props}
		/>
	);
};

// MARK: Separator

export type { DateInputProps, DateSegmentProps, InputGroupAddonProps, InputGroupProps, InputProps, TextAreaProps };
export { DateInput, DateSegment, Input, InputGroup, InputGroupAddon, TextArea };
