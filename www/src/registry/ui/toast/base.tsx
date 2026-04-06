"use client";

import {
	UNSTABLE_Toast as AriaToast,
	UNSTABLE_ToastContent as AriaToastContent,
	UNSTABLE_ToastQueue as AriaToastQueue,
	UNSTABLE_ToastRegion as AriaToastRegion,
	composeRenderProps,
	Text,
} from "react-aria-components";
import type { ToastProps as AriaToastProps } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: toastStyles

interface Toast {
	title: string;
	description?: string;
	variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

const queue = new AriaToastQueue<Toast>();

const Toaster = () => {
	const { region } = useStyles()();
	return (
		<AriaToastRegion queue={queue} className={region()}>
			{({ toast }) => <ToastItem toast={toast} />}
		</AriaToastRegion>
	);
};

interface ToastProps extends AriaToastProps<Toast> {}

function ToastItem({ className, ...props }: ToastProps) {
	const { toast: toastStyle, content, title, description, actions } = useStyles()();
	return (
		<AriaToast
			className={composeRenderProps(className, (className) =>
				toastStyle({ className, variant: props.toast.content.variant }),
			)}
			{...props}
		>
			{({ toast }) => (
				<>
					<AriaToastContent className={content()}>
						<Text slot="title" className={title()}>
							{toast.content.title}
						</Text>
						{toast.content.description ? (
							<Text slot="description" className={description()}>
								{toast.content.description}
							</Text>
						) : null}
					</AriaToastContent>
					<div className={actions()}>
						{/* <Button
              variant="quiet"
              size="sm"
              slot="close"
              className={close()}
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </Button> */}
					</div>
				</>
			)}
		</AriaToast>
	);
}

export { queue as toast, Toaster };
