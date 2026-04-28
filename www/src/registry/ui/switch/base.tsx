"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SwitchPrimitives from "react-aria-components/Switch";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "@/registry/lib/context";

import { useStyles } from "./styles";
import type { SwitchStyles } from "./styles";

// MARK: switchStyles

// MARK: Separator

interface InternalSwitchContextValue extends SwitchPrimitives.SwitchRenderProps, VariantProps<SwitchStyles> {}

const [InternalSwitchProvider, useInternalSwitch] = createContext<InternalSwitchContextValue>({
	strict: true,
});

// MARK: Separator

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitives.Switch>, VariantProps<SwitchStyles> {}

const Switch = ({ children, variant, size, className, ...props }: SwitchProps) => {
	const { root } = useStyles()();
	return (
		<SwitchPrimitives.Switch
			className={composeRenderProps(className, (className) => root({ variant, size, className }))}
			{...props}
		>
			{composeRenderProps(children, (children, renderProps) => {
				return (
					<InternalSwitchProvider value={{ ...renderProps, variant, size }}>
						{children ? (
							children
						) : (
							<SwitchIndicator>
								<SwitchThumb />
							</SwitchIndicator>
						)}
					</InternalSwitchProvider>
				);
			})}
		</SwitchPrimitives.Switch>
	);
};

// MARK: Separator

interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
	const { indicator } = useStyles()();
	const ctx = useInternalSwitch("SwitchIndicator");
	return (
		<span
			data-rac=""
			data-selected={ctx.isSelected || undefined}
			data-pressed={ctx.isPressed || undefined}
			data-hovered={ctx.isHovered || undefined}
			data-focused={ctx.isFocused || undefined}
			data-focus-visible={ctx.isFocusVisible || undefined}
			data-disabled={ctx.isDisabled || undefined}
			data-readonly={ctx.isReadOnly || undefined}
			className={indicator({ variant: ctx.variant, size: ctx.size, className })}
			{...props}
		/>
	);
};

// MARK: Separator

interface SwitchThumbProps extends React.ComponentProps<"span"> {}

const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
	const { thumb } = useStyles()();
	const ctx = useInternalSwitch("SwitchThumb");
	return <span className={thumb({ variant: ctx.variant, size: ctx.size, className })} {...props} />;
};

// MARK: Separator

export type { SwitchIndicatorProps, SwitchProps, SwitchThumbProps };
export { Switch, SwitchIndicator, SwitchThumb };
