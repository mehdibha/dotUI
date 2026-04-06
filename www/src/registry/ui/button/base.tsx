"use client";

import {
	Button as AriaButton,
	ButtonContext as AriaButtonContext,
	Link as AriaLink,
	composeRenderProps,
} from "react-aria-components";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@/registry/lib/context";
import { Loader } from "@/registry/ui/loader";

import { buttonStyles, useStyles } from "./styles";
import type { ButtonStyles } from "./styles";

// MARK: buttonStyles

type ButtonVariants = VariantProps<ButtonStyles>;

const [ButtonProvider, useContextProps] = createVariantsContext<
	ButtonVariants,
	React.ComponentProps<typeof AriaButton>
>(AriaButtonContext);

// MARK: seperator

interface ButtonProps extends React.ComponentProps<typeof AriaButton>, ButtonVariants {
	aspect?: "default" | "square" | "auto";
}

const Button = (localProps: ButtonProps) => {
	const styles = useStyles();
	const { variant, size, aspect = "auto", className, slot, style, children, ...props } = useContextProps(localProps);

	const isIconOnly = useButtonAspect(children, aspect);

	return (
		<AriaButton
			data-button=""
			data-icon-only={isIconOnly || undefined}
			className={composeRenderProps(className, (cn) => styles({ variant, size, className: cn }))}
			slot={slot}
			style={style}
			{...props}
		>
			{composeRenderProps(children, (children, { isPending }) => (
				<>
					{isPending && (
						<Loader
							data-slot="spinner"
							aria-label="loading"
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
						/>
					)}
					{typeof children === "string" ? <span className="truncate">{children}</span> : children}
				</>
			))}
		</AriaButton>
	);
};

// MARK: seperator

interface LinkButtonProps extends React.ComponentProps<typeof AriaLink>, VariantProps<ButtonStyles> {
	aspect?: "default" | "square" | "auto";
}

const LinkButton = (localProps: LinkButtonProps) => {
	const styles = useStyles();
	const { variant, size, aspect = "auto", className, slot, style, children, ...props } = useContextProps(localProps);

	const isIconOnly = useButtonAspect(children, aspect);

	return (
		<AriaLink
			data-slot="button"
			data-button=""
			data-icon-only={isIconOnly || undefined}
			className={composeRenderProps(className, (cn) => styles({ variant, size, className: cn }))}
			slot={slot}
			style={style}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>{typeof children === "string" ? <span className="truncate">{children}</span> : children}</>
			))}
		</AriaLink>
	);
};

// MARK: seperator

export type { ButtonProps, LinkButtonProps };
export { Button, ButtonProvider, buttonStyles, LinkButton };
