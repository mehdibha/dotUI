"use client";

import React, { useCallback } from "react";
import { chain } from "react-aria";
import { mergeRefs } from "react-aria/mergeRefs";
import { getEventTarget } from "react-aria/private/utils/shadowdom/DOMFunctions";
import { useLayoutEffect } from "react-aria/private/utils/useLayoutEffect";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitive from "react-aria-components/DateField";
import * as GroupPrimitive from "react-aria-components/Group";
import * as InputPrimitive from "react-aria-components/Input";
import * as TextAreaPrimitive from "react-aria-components/TextArea";
import { useControlledState } from "react-stately/useControlledState";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { InputStyles } from "./styles";

// MARK: Separator

type InputGroupContextValue = {
	size: NonNullable<VariantProps<InputStyles>["size"]>;
	orientation: NonNullable<VariantProps<InputStyles>["orientation"]>;
};

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

const useInputGroupContext = () => React.useContext(InputGroupContext);

// MARK: Separator

interface InputGroupProps
	extends React.ComponentProps<typeof GroupPrimitive.Group>,
		Pick<VariantProps<InputStyles>, "size" | "orientation"> {}

const INTERACTIVE_SELECTOR = "button,input,textarea,[role='button']";

const focusInnerInput = (group: HTMLElement) => {
	(group.querySelector("input, textarea") as HTMLElement | null)?.focus();
};

const InputGroup = ({
	className,
	size = "md",
	orientation = "horizontal",
	onPointerDown,
	onTouchEnd,
	...props
}: InputGroupProps) => {
	const { inputGroup } = useStyles()();
	const contextValue = React.useMemo(() => ({ size, orientation }), [size, orientation]);
	return (
		<InputGroupContext.Provider value={contextValue}>
			<GroupPrimitive.Group
				data-input-group=""
				data-size={size}
				data-orientation={orientation}
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
				className={composeRenderProps(className, (className) => inputGroup({ size, orientation, className }))}
				{...props}
			/>
		</InputGroupContext.Provider>
	);
};

// MARK: Separator

interface InputProps
	extends Omit<React.ComponentProps<typeof InputPrimitive.Input>, "size">,
		Pick<VariantProps<InputStyles>, "size"> {}

const Input = ({ size: sizeProp, className, ...props }: InputProps) => {
	const context = useInputGroupContext();
	const size = sizeProp ?? context?.size ?? "md";
	const { input } = useStyles()();
	return (
		<InputPrimitive.Input
			data-input=""
			data-size={size}
			className={composeRenderProps(className, (className) =>
				input({ className, size, orientation: context?.orientation }),
			)}
			{...props}
		/>
	);
};

// MARK: Separator

interface TextAreaProps
	extends Omit<React.ComponentProps<typeof TextAreaPrimitive.TextArea>, "size">,
		Pick<VariantProps<InputStyles>, "size"> {}

const TextArea = ({ ref, className, onChange, size: sizeProp, ...props }: TextAreaProps) => {
	const context = useInputGroupContext();
	const size = sizeProp ?? context?.size;
	const { textArea } = useStyles()();
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
		<TextAreaPrimitive.TextArea
			ref={mergeRefs(inputRef, ref as React.RefObject<HTMLTextAreaElement | null>)}
			data-textarea=""
			data-size={size}
			onChange={chain(onChange, setInputValue)}
			className={composeRenderProps(className, (className) => textArea({ className, size }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface InputGroupAddonProps extends React.ComponentProps<"div"> {}

function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
	const context = useInputGroupContext();
	const { inputGroupAddon } = useStyles()();
	return (
		<div
			data-input-group-addon=""
			data-size={context?.size}
			data-orientation={context?.orientation}
			className={inputGroupAddon({
				size: context?.size,
				orientation: context?.orientation,
				className,
			})}
			{...props}
		/>
	);
}

// MARK: Separator

interface DateInputProps
	extends Omit<DateFieldPrimitive.DateInputProps, "children">,
		Pick<VariantProps<InputStyles>, "size"> {
	children?: DateFieldPrimitive.DateInputProps["children"];
}

const DateInput = ({ className, size: sizeProp, ...props }: DateInputProps) => {
	const context = useInputGroupContext();
	const size = sizeProp ?? context?.size;
	const { dateInput } = useStyles()();
	return (
		<DateFieldPrimitive.DateInput
			data-date-input=""
			data-size={size}
			className={composeRenderProps(className, (className) => dateInput({ className, size }))}
			{...props}
		>
			{props.children ? props.children : (segment) => <DateSegment segment={segment} />}
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

export type {
	DateInputProps,
	DateSegmentProps,
	InputGroupAddonProps,
	InputGroupContextValue,
	InputGroupProps,
	InputProps,
	TextAreaProps,
};
export {
	DateInput,
	DateSegment,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupContext,
	TextArea,
	useInputGroupContext,
};
