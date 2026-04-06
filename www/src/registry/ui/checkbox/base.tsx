"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as AriaCheckbox, composeRenderProps } from "react-aria-components";
import type * as React from "react";
import type { CheckboxRenderProps } from "react-aria-components";

import { createContext } from "@/registry/lib/context";
import { cn } from "@/registry/lib/utils";

import { useStyles } from "./styles";

// MARK: checkboxStyles

const [InternalCheckboxProvider, useInternalCheckbox] = createContext<CheckboxRenderProps>({
	strict: true,
});

// MARK: seperator

interface CheckboxProps extends React.ComponentProps<typeof AriaCheckbox> {}

const Checkbox = ({ className, ...props }: CheckboxProps) => {
	const { root, indicator } = useStyles()();
	return (
		<AriaCheckbox
			data-slot="checkbox"
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
				return children ? (
					<InternalCheckboxProvider value={renderProps}>{children}</InternalCheckboxProvider>
				) : renderProps.isIndeterminate ? (
					<MinusIcon className="size-3" />
				) : (
					<CheckIcon className="size-3" />
				);
			})}
		</AriaCheckbox>
	);
};

// MARK: seperator

interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
	const { indicator } = useStyles()();
	const ctx = useInternalCheckbox("CheckboxIndicator");
	return (
		<div
			data-rac=""
			data-selected={ctx.isSelected || undefined}
			data-indeterminate={ctx.isIndeterminate || undefined}
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
			{ctx.isIndeterminate ? <MinusIcon className="size-2.5" /> : <CheckIcon className="size-3" />}
		</div>
	);
};

// MARK: seperator

export type { CheckboxIndicatorProps, CheckboxProps };
export { Checkbox, CheckboxIndicator };
