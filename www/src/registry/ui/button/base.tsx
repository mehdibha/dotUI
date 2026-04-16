"use client";

import * as ButtonPrimitive from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitive from "react-aria-components/Link";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { Loader } from "@/registry/ui/loader";

import { buttonStyles, useStyles } from "./styles";
import type { ButtonStyles } from "./styles";

// MARK: buttonStyles

type ButtonVariants = VariantProps<ButtonStyles>;

// MARK: seperator

interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive.Button>, ButtonVariants {}

const Button = ({ variant, size, className, children, ...props }: ButtonProps) => {
	const styles = useStyles();

	return (
		<ButtonPrimitive.Button
			data-button=""
			className={composeRenderProps(className, (cn) => styles({ variant, size, className: cn }))}
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
		</ButtonPrimitive.Button>
	);
};

// MARK: seperator

interface LinkButtonProps extends React.ComponentProps<typeof LinkPrimitive.Link>, VariantProps<ButtonStyles> {}

const LinkButton = ({ variant, size, className, children, ...props }: LinkButtonProps) => {
	const styles = useStyles();

	return (
		<LinkPrimitive.Link
			data-slot="button"
			data-button=""
			className={composeRenderProps(className, (cn) => styles({ variant, size, className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>{typeof children === "string" ? <span className="truncate">{children}</span> : children}</>
			))}
		</LinkPrimitive.Link>
	);
};

// MARK: seperator

export type { ButtonProps, LinkButtonProps };
export { Button, buttonStyles, LinkButton };
