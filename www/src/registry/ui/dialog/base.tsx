"use client";

import * as DialogPrimitives from "react-aria-components/Dialog";
import * as HeadingPrimitives from "react-aria-components/Heading";
import * as TextPrimitives from "react-aria-components/Text";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: dialogStyles

// MARK: Separator

interface DialogProps extends React.ComponentProps<typeof DialogPrimitives.DialogTrigger> {}

const Dialog = (props: DialogProps) => {
	return <DialogPrimitives.DialogTrigger {...props} />;
};

// MARK: Separator

interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitives.Dialog> {}

const DialogContent = ({ className, ...props }: DialogContentProps) => {
	const { content } = useStyles()();
	return <DialogPrimitives.Dialog data-slot="dialog-content" className={content({ className })} {...props} />;
};

// MARK: Separator

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	const { header } = useStyles()();
	return <header className={header({ className })} {...props} />;
};

// MARK: Separator

interface DialogHeadingProps extends React.ComponentProps<typeof HeadingPrimitives.Heading> {}

const DialogHeading = ({ className, ...props }: DialogHeadingProps) => {
	const { heading } = useStyles()();
	return <HeadingPrimitives.Heading className={heading({ className })} {...props} />;
};

// MARK: Separator

interface DialogDescriptionProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	const { description } = useStyles()();
	return <TextPrimitives.Text slot="description" className={description({ className })} {...props} />;
};

// MARK: Separator

interface DialogBodyProps extends React.ComponentProps<"div"> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
	const { body } = useStyles()();
	return <div className={body({ className })} {...props} />;
};

// MARK: Separator

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	const { footer } = useStyles()();
	return <footer className={footer({ className })} {...props} />;
};

// MARK: Separator

type DialogInsetProps = React.ComponentProps<"div">;

const DialogInset = ({ className, ...props }: DialogInsetProps) => {
	const { inset } = useStyles()();
	return <div className={inset({ className })} {...props} />;
};

// MARK: Separator

export type {
	DialogBodyProps,
	DialogContentProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogHeadingProps,
	DialogInsetProps,
	DialogProps,
};
export { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogHeading, DialogInset };
