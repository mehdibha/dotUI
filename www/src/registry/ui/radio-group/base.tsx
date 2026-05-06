"use client";

import { createContext, useContext, useId } from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { LabelContext } from "react-aria-components/Label";
import * as RadioGroupPrimitives from "react-aria-components/RadioGroup";
import { Provider } from "react-aria-components/slots";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: radioGroupStyles

const radioGroupStyles = tv({
	base: "flex flex-col gap-3",
});

const RadioGroup = ({ className, ...props }: RadioGroupPrimitives.RadioGroupProps) => {
	return (
		<RadioGroupPrimitives.RadioGroup
			className={composeRenderProps(className, (className) => radioGroupStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: Separator

const InternalRadioContext = createContext<RadioGroupPrimitives.RadioButtonRenderProps | null>(null);

interface RadioProps extends React.ComponentProps<typeof RadioGroupPrimitives.RadioField> {}

const Radio = ({ id: idProp, className, ...props }: RadioProps) => {
	const { root } = useStyles()();
	const autoId = useId();
	const id = idProp ?? autoId;
	return (
		<RadioGroupPrimitives.RadioField
			id={id}
			data-slot="radio"
			data-radio=""
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => {
				const content =
					typeof children === "string" || typeof children === "number" ? (
						<RadioControl>
							<RadioIndicator />
							{children}
						</RadioControl>
					) : (
						(children ?? <RadioControl />)
					);
				return <Provider values={[[LabelContext, { htmlFor: id }]]}>{content}</Provider>;
			})}
		</RadioGroupPrimitives.RadioField>
	);
};

interface RadioControlProps extends React.ComponentProps<typeof RadioGroupPrimitives.RadioButton> {}

const RadioControl = ({ className, ...props }: RadioControlProps) => {
	const { control } = useStyles()();
	return (
		<RadioGroupPrimitives.RadioButton
			data-radio-control=""
			className={composeRenderProps(className, (className) => control({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, renderProps) => {
				return (
					<Provider
						values={[
							[InternalRadioContext, renderProps],
							[LabelContext, { elementType: "span" }],
						]}
					>
						{children ?? <RadioIndicator />}
					</Provider>
				);
			})}
		</RadioGroupPrimitives.RadioButton>
	);
};

interface RadioIndicatorProps extends React.ComponentProps<"span"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
	const { indicator } = useStyles()();
	const ctx = useContext(InternalRadioContext);
	return (
		<span
			data-rac=""
			data-selected={ctx?.isSelected || undefined}
			data-pressed={ctx?.isPressed || undefined}
			data-hovered={ctx?.isHovered || undefined}
			data-focused={ctx?.isFocused || undefined}
			data-focus-visible={ctx?.isFocusVisible || undefined}
			data-disabled={ctx?.isDisabled || undefined}
			data-readonly={ctx?.isReadOnly || undefined}
			data-invalid={ctx?.isInvalid || undefined}
			data-required={ctx?.isRequired || undefined}
			className={indicator({ className })}
			{...props}
		>
			<span />
		</span>
	);
};

// MARK: Separator

type RadioGroupProps = RadioGroupPrimitives.RadioGroupProps;

export type { RadioControlProps, RadioGroupProps, RadioIndicatorProps, RadioProps };
export { Radio, RadioControl, RadioGroup, RadioIndicator };
