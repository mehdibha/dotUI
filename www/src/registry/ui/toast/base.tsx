"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";

import { useStyles } from "./styles";
import type { ToastData, ToastPosition, ToastVariant } from "./types";

type ToastObject = ToastPrimitive.Root.ToastObject<ToastData>;

const toastIcons = {
	danger: CircleAlertIcon,
	error: CircleAlertIcon,
	info: InfoIcon,
	loading: LoaderCircleIcon,
	success: CircleCheckIcon,
	warning: TriangleAlertIcon,
} as const;

const defaultToastManager = ToastPrimitive.createToastManager<ToastData>();

function getToastVariant(type: string | undefined): ToastVariant {
	return type && type in toastIcons ? (type as ToastVariant) : "neutral";
}

function getSwipeDirection(position: ToastPosition): ToastPrimitive.Root.Props["swipeDirection"] {
	const verticalDirection = position.startsWith("top") ? "up" : "down";

	if (position.endsWith("center")) {
		return [verticalDirection];
	}

	if (position.endsWith("left")) {
		return ["left", verticalDirection];
	}

	return ["right", verticalDirection];
}

interface ToastProviderProps extends ToastPrimitive.Provider.Props {
	position?: ToastPosition;
	portalProps?: ToastPrimitive.Portal.Props;
}

function ToastProvider({
	children,
	limit = 3,
	position = "bottom-right",
	portalProps,
	timeout = 5000,
	toastManager = defaultToastManager,
	...props
}: ToastProviderProps) {
	return (
		<ToastPrimitive.Provider limit={limit} timeout={timeout} toastManager={toastManager} {...props}>
			{children}
			<ToastList position={position} portalProps={portalProps} />
		</ToastPrimitive.Provider>
	);
}

interface ToastListProps {
	position: ToastPosition;
	portalProps?: ToastPrimitive.Portal.Props;
}

function ToastList({ position, portalProps }: ToastListProps) {
	const { toasts } = ToastPrimitive.useToastManager<ToastData>();
	const { viewport } = useStyles()();

	return (
		<ToastPrimitive.Portal {...portalProps}>
			<ToastPrimitive.Viewport data-slot="toast-viewport" data-position={position} className={viewport({ position })}>
				{toasts.map((toastItem) => (
					<ToastItem key={toastItem.id} position={position} toast={toastItem} />
				))}
			</ToastPrimitive.Viewport>
		</ToastPrimitive.Portal>
	);
}

interface ToastItemProps {
	position: ToastPosition;
	toast: ToastObject;
}

function ToastItem({ position, toast: toastItem }: ToastItemProps) {
	const data = toastItem.data;
	const variant = getToastVariant(toastItem.type);
	const Icon = variant === "neutral" ? null : toastIcons[variant];
	const { action, actions, body, content, description, icon, message, title, toast: toastStyle } = useStyles()();

	return (
		<ToastPrimitive.Root
			{...data?.rootProps}
			data-position={position}
			data-slot="toast"
			swipeDirection={getSwipeDirection(position)}
			toast={toastItem}
			className={toastStyle({ position, variant })}
		>
			<ToastPrimitive.Content className={content()}>
				<div className={body()}>
					{Icon ? (
						<div data-slot="toast-icon" className={icon({ variant })}>
							<Icon aria-hidden="true" />
						</div>
					) : null}
					<div data-slot="toast-message" className={message()}>
						<ToastPrimitive.Title data-slot="toast-title" className={title({ variant })} />
						<ToastPrimitive.Description data-slot="toast-description" className={description({ variant })} />
					</div>
				</div>
				{toastItem.actionProps ? (
					<div data-slot="toast-actions" className={actions()}>
						<ToastPrimitive.Action data-slot="toast-action" className={action()} />
					</div>
				) : null}
			</ToastPrimitive.Content>
		</ToastPrimitive.Root>
	);
}

const Toaster = ToastProvider;

export type { ToastProviderProps };
export { defaultToastManager as toastManager, Toaster, ToastPrimitive, ToastProvider };
