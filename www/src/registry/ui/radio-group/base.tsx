"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as RadioGroupPrimitives from "react-aria-components/RadioGroup";

import { createContext } from "@/registry/lib/context";
import { cn } from "@/registry/lib/utils";
import { fieldStyles } from "@/registry/ui/field";

import { useStyles } from "./styles";

// MARK: radioGroupStyles

const { field } = fieldStyles();

const RadioGroup = ({ className, ...props }: RadioGroupPrimitives.RadioGroupProps) => {
	return (
		<RadioGroupPrimitives.RadioGroup
			className={composeRenderProps(className, (className) => field({ className }))}
			{...props}
		/>
	);
};

// MARK: seperator

const [InternalRadioProvider, useInternalRadio] = createContext<RadioGroupPrimitives.RadioRenderProps>({
	strict: true,
});

interface RadioProps extends React.ComponentProps<typeof RadioGroupPrimitives.Radio> {}

const Radio = ({ className, ...props }: RadioProps) => {
	const { root, indicator } = useStyles()();
	return (
		<RadioGroupPrimitives.Radio
			data-slot="radio"
			data-radio=""
			className={composeRenderProps(className, (className) =>
				props.children
					? root({ className })
					: indicator({
							className: cn(className, "focus-reset focus-visible:focus-ring"),
						}),
			)}
			{...props}
		>
			{composeRenderProps(props.children, (children, renderProps) => {
				return children ? <InternalRadioProvider value={renderProps}>{children}</InternalRadioProvider> : <span />;
			})}
		</RadioGroupPrimitives.Radio>
	);
};

interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
	const { indicator } = useStyles()();
	const ctx = useInternalRadio("RadioIndicator");
	return (
		<div
			data-rac=""
			data-selected={ctx.isSelected || undefined}
			data-pressed={ctx.isPressed || undefined}
			data-hovered={ctx.isHovered || undefined}
			data-focused={ctx.isFocused || undefined}
			data-focus-visible={ctx.isFocusVisible || undefined}
			data-disabled={ctx.isDisabled || undefined}
			data-readonly={ctx.isReadOnly || undefined}
			data-invalid={ctx.isInvalid || undefined}
			data-required={ctx.isRequired || undefined}
			className={indicator({ className })}
			{...props}
		>
			<span />
		</div>
	);
};

// MARK: seperator

type RadioGroupProps = RadioGroupPrimitives.RadioGroupProps;

export type { RadioGroupProps, RadioIndicatorProps, RadioProps };
export { Radio, RadioGroup, RadioIndicator };
