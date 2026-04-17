"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TextPrimitives from "react-aria-components/Text";
import * as ToastPrimitives from "react-aria-components/Toast";

import { useStyles } from "./styles";

// MARK: toastStyles

interface Toast {
	title: string;
	description?: string;
	variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

const queue = new ToastPrimitives.UNSTABLE_ToastQueue<Toast>();

const Toaster = () => {
	const { region } = useStyles()();
	return (
		<ToastPrimitives.UNSTABLE_ToastRegion queue={queue} className={region()}>
			{({ toast }) => <ToastItem toast={toast} />}
		</ToastPrimitives.UNSTABLE_ToastRegion>
	);
};

interface ToastProps extends ToastPrimitives.ToastProps<Toast> {}

function ToastItem({ className, ...props }: ToastProps) {
	const { toast: toastStyle, content, title, description, actions } = useStyles()();
	return (
		<ToastPrimitives.UNSTABLE_Toast
			className={composeRenderProps(className, (className) =>
				toastStyle({ className, variant: props.toast.content.variant }),
			)}
			{...props}
		>
			{({ toast }) => (
				<>
					<ToastPrimitives.UNSTABLE_ToastContent className={content()}>
						<TextPrimitives.Text slot="title" className={title()}>
							{toast.content.title}
						</TextPrimitives.Text>
						{toast.content.description ? (
							<TextPrimitives.Text slot="description" className={description()}>
								{toast.content.description}
							</TextPrimitives.Text>
						) : null}
					</ToastPrimitives.UNSTABLE_ToastContent>
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
		</ToastPrimitives.UNSTABLE_Toast>
	);
}

export { queue as toast, Toaster };
