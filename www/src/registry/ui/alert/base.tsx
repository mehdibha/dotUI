import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { AlertStyles } from "./styles";

// MARK: alertStyles

// MARK: Separator

interface AlertProps extends React.ComponentProps<"div">, VariantProps<AlertStyles> {}

function Alert({ className, variant, ...props }: AlertProps) {
	const { root } = useStyles()();
	return <div data-alert="" role="alert" className={root({ variant, className })} {...props} />;
}

// MARK: Separator

interface AlertTitleProps extends React.ComponentProps<"div"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
	const { title } = useStyles()();
	return <div data-alert-title="" className={title({ className })} {...props} />;
}

// MARK: Separator

interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
	const { description } = useStyles()();
	return <div data-alert-description="" className={description({ className })} {...props} />;
}

// MARK: Separator

interface AlertActionProps extends React.ComponentProps<"div"> {}

function AlertAction({ className, ...props }: AlertActionProps) {
	const { action } = useStyles()();
	return <div data-alert-action="" className={action({ className })} {...props} />;
}

// MARK: Separator

export type { AlertActionProps, AlertDescriptionProps, AlertProps, AlertTitleProps };
export { Alert, AlertAction, AlertDescription, AlertTitle };
