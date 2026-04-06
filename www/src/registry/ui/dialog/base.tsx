"use client";

import {
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	Heading as AriaHeading,
	Text as AriaText,
} from "react-aria-components";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: dialogStyles

// MARK: seperator

interface DialogProps extends React.ComponentProps<typeof AriaDialogTrigger> {}

const Dialog = (props: DialogProps) => {
	return <AriaDialogTrigger {...props} />;
};

// MARK: seperator

interface DialogContentProps extends React.ComponentProps<typeof AriaDialog> {}

const DialogContent = ({ className, ...props }: DialogContentProps) => {
	const { content } = useStyles()();
	return <AriaDialog data-slot="dialog-content" className={content({ className })} {...props} />;
};

// MARK: seperator

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	const { header } = useStyles()();
	return <header className={header({ className })} {...props} />;
};

// MARK: seperator

interface DialogHeadingProps extends React.ComponentProps<typeof AriaHeading> {}

const DialogHeading = ({ className, ...props }: DialogHeadingProps) => {
	const { heading } = useStyles()();
	return <AriaHeading className={heading({ className })} {...props} />;
};

// MARK: seperator

interface DialogDescriptionProps extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	const { description } = useStyles()();
	return <AriaText slot="description" className={description({ className })} {...props} />;
};

// MARK: seperator

interface DialogBodyProps extends React.ComponentProps<"div"> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
	const { body } = useStyles()();
	return <div className={body({ className })} {...props} />;
};

// MARK: seperator

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	const { footer } = useStyles()();
	return <footer className={footer({ className })} {...props} />;
};

// MARK: seperator

type DialogInsetProps = React.ComponentProps<"div">;

const DialogInset = ({ className, ...props }: DialogInsetProps) => {
	const { inset } = useStyles()();
	return <div className={inset({ className })} {...props} />;
};

// MARK: seperator

export { Dialog, DialogHeader, DialogHeading, DialogDescription, DialogContent, DialogBody, DialogFooter, DialogInset };

export type {
	DialogProps,
	DialogBodyProps,
	DialogHeaderProps,
	DialogHeadingProps,
	DialogDescriptionProps,
	DialogContentProps,
	DialogFooterProps,
	DialogInsetProps,
};
