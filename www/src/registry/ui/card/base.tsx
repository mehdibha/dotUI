import type * as React from "react";

import { useStyles } from "./styles";

// MARK: cardStyles

// MARK: Card

interface CardProps extends React.ComponentProps<"div"> {}

function Card({ className, ...props }: CardProps) {
	const { root } = useStyles()();
	return <div data-card="" className={root({ className })} {...props} />;
}

// MARK: CardHeader

interface CardHeaderProps extends React.ComponentProps<"div"> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
	const { header } = useStyles()();
	return <div data-card-header="" className={header({ className })} {...props} />;
}

// MARK: CardTitle

interface CardTitleProps extends React.ComponentProps<"div"> {}

function CardTitle({ className, ...props }: CardTitleProps) {
	const { title } = useStyles()();
	return <div data-card-title="" className={title({ className })} {...props} />;
}

// MARK: CardDescription

interface CardDescriptionProps extends React.ComponentProps<"div"> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
	const { description } = useStyles()();
	return <div data-card-description="" className={description({ className })} {...props} />;
}

// MARK: CardAction

interface CardActionProps extends React.ComponentProps<"div"> {}

function CardAction({ className, ...props }: CardActionProps) {
	const { action } = useStyles()();
	return <div data-card-action="" className={action({ className })} {...props} />;
}

// MARK: CardContent

interface CardContentProps extends React.ComponentProps<"div"> {}

function CardContent({ className, ...props }: CardContentProps) {
	const { content } = useStyles()();
	return <div data-card-content="" className={content({ className })} {...props} />;
}

// MARK: CardFooter

interface CardFooterProps extends React.ComponentProps<"div"> {}

function CardFooter({ className, ...props }: CardFooterProps) {
	const { footer } = useStyles()();
	return <div data-card-footer="" className={footer({ className })} {...props} />;
}

// MARK: separator

export type {
	CardActionProps,
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
};
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
