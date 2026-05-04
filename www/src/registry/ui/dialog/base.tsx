"use client";

import { XIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DialogPrimitives from "react-aria-components/Dialog";
import * as HeadingPrimitives from "react-aria-components/Heading";
import * as TextPrimitives from "react-aria-components/Text";
import type * as React from "react";

import { Button } from "@/registry/ui/button";
import { ScrollFade } from "@/registry/ui/scroll-fade";

import { useStyles } from "./styles";

// MARK: dialogStyles

// MARK: Separator

interface DialogProps extends React.ComponentProps<typeof DialogPrimitives.DialogTrigger> {}

const Dialog = (props: DialogProps) => {
	return <DialogPrimitives.DialogTrigger {...props} />;
};

// MARK: Separator

interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitives.Dialog> {}

const DialogContent = ({ className, children, ...props }: DialogContentProps) => {
	const { content, closeButton } = useStyles()();
	return (
		<DialogPrimitives.Dialog data-slot="dialog-content" className={content({ className })} {...props}>
			{composeRenderProps(children, (children) => (
				<>
					{children}
					<Button slot="close" variant="quiet" size="sm" isIconOnly className={closeButton()}>
						<XIcon />
					</Button>
				</>
			))}
		</DialogPrimitives.Dialog>
	);
};

// MARK: Separator

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	const { header } = useStyles()();
	return <header data-slot="dialog-header" className={header({ className })} {...props} />;
};

// MARK: Separator

interface DialogTitleProps extends React.ComponentProps<typeof HeadingPrimitives.Heading> {}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	const { title } = useStyles()();
	return <HeadingPrimitives.Heading data-slot="dialog-heading" className={title({ className })} {...props} />;
};

// MARK: Separator

interface DialogDescriptionProps extends Omit<React.ComponentProps<typeof TextPrimitives.Text>, "slot"> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	const { description } = useStyles()();
	return <TextPrimitives.Text data-slot="dialog-description" className={description({ className })} {...props} />;
};

// MARK: Separator

interface DialogBodyProps extends React.ComponentProps<"div"> {
	scrollFade?: boolean;
}

const DialogBody = ({ className, scrollFade = true, ...props }: DialogBodyProps) => {
	const { body } = useStyles()();
	const ElementType = scrollFade ? ScrollFade : "div";

	return <ElementType data-slot="dialog-body" className={body({ className })} {...props} />;
};

// MARK: Separator

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	const { footer } = useStyles()();
	return <footer data-slot="dialog-footer" className={footer({ className })} {...props} />;
};

// MARK: Separator

export type {
	DialogBodyProps,
	DialogContentProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogProps,
	DialogTitleProps,
};
export { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle };
