"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { tv } from "tailwind-variants";

const toastVariants = tv({
  slots: {
    viewport:
      "fixed z-50 mx-auto flex w-[calc(100vw-(var(--toast-inset)*2))] max-w-96 focus-reset outline-none [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(6)] data-[position*=bottom]:bottom-(--toast-inset) data-[position*=top]:top-(--toast-inset) data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2 data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset)",
    toast:
      "absolute z-[calc(50-var(--toast-index))] h-(--toast-calc-height) w-full overflow-hidden rounded-sm shadow-(--shadow-modal,var(--shadow-lg)) focus-reset outline-none select-none focus-visible:focus-ring [--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))] after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full data-[position*=bottom]:after:bottom-full data-[position*=top]:after:top-full data-ending-style:opacity-0 data-limited:opacity-0 data-expanded:h-(--toast-height) data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index),1))] data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index),1))] data-[position*=center]:right-0 data-[position*=center]:left-0 data-[position*=left]:right-auto data-[position*=left]:left-0 data-[position*=right]:right-0 data-[position*=right]:left-auto data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))] data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))] data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))] data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))] data-[position*=bottom]:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))] data-[position*=top]:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))] data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))] data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))] data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))] data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))] data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))] data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))] data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))] border transition-[transform,opacity,height,background-color,border-color] duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] data-ending-style:data-swipe-direction:duration-200 data-ending-style:data-swipe-direction:ease-out motion-reduce:transition-none data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))] data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))] data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))] border-transparent bg-inverse text-fg-inverse",
    content:
      "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden text-sm data-behind:opacity-0 data-behind:not-data-expanded:pointer-events-none data-expanded:opacity-100 min-h-16 px-4 py-3.5 transition-opacity duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none [--surface-bg:var(--color-inverse)]",
    body: "flex min-w-0 items-center gap-2",
    icon: "flex size-4 shrink-0 items-center justify-center **:[svg]:size-4 **:[svg]:shrink-0",
    message: "flex min-w-0 flex-1 flex-col gap-0.5",
    title:
      "font-sans font-medium tracking-normal empty:hidden text-sm leading-snug",
    description: "empty:hidden text-sm leading-snug text-fg-inverse",
    actions: "ml-2 flex shrink-0 items-center gap-1",
    action: "max-w-32 empty:hidden **:[span]:truncate",
  },
  variants: {
    onFill: {
      true: {
        action: "text-current hover:bg-current/10 pressed:bg-current/20",
      },
    },
    position: {
      "top-left": {},
      "top-center": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-center": {},
      "bottom-right": {},
    },
    variant: {
      neutral: {},
      success: {
        icon: "text-success",
      },
      warning: {
        icon: "text-warning",
      },
      danger: {
        icon: "text-danger",
      },
      error: {
        icon: "text-danger",
      },
      info: {
        icon: "text-info",
      },
      loading: {},
    },
  },
  defaultVariants: {
    position: "bottom-right",
    variant: "neutral",
  },
});

const {
  viewport,
  action,
  actions,
  body,
  content,
  description,
  icon,
  message,
  title,
  toast: toastStyle,
} = toastVariants();

type ToastVariant =
  | "neutral"
  | "success"
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "loading";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastData {
  /**
   * Props forwarded to the root toast element.
   */
  rootProps?: Omit<
    ToastPrimitive.Root.Props,
    "children" | "className" | "swipeDirection" | "toast"
  >;
}

type ToastObject = ToastPrimitive.Root.ToastObject<ToastData>;

const toastIcons = {
  danger: CircleAlertIcon,
  error: CircleAlertIcon,
  info: InfoIcon,
  loading: Loader,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
} as const;

const defaultToastManager = ToastPrimitive.createToastManager<ToastData>();
// Whether a status toast's own fill is solid; undefined sits on the surface.

function getToastVariant(type: string | undefined): ToastVariant {
  return type && type in toastIcons ? (type as ToastVariant) : "neutral";
}

function getSwipeDirection(
  position: ToastPosition,
): ToastPrimitive.Root.Props["swipeDirection"] {
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
  position,
  portalProps,
  timeout = 5000,
  toastManager = defaultToastManager,
  ...props
}: ToastProviderProps) {
  const { defaultVariants } = toastVariants;
  return (
    <ToastPrimitive.Provider
      limit={limit}
      timeout={timeout}
      toastManager={toastManager}
      {...props}
    >
      {children}
      <ToastList
        position={position ?? defaultVariants.position ?? "bottom-right"}
        portalProps={portalProps}
      />
    </ToastPrimitive.Provider>
  );
}

interface ToastListProps {
  position: ToastPosition;
  portalProps?: ToastPrimitive.Portal.Props;
}

function ToastList({ position, portalProps }: ToastListProps) {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>();
  return (
    <ToastPrimitive.Portal {...portalProps}>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        data-position={position}
        className={viewport({ position })}
      >
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
  const inverseSurface = true;
  const solidStatus = undefined;
  const onFill =
    (variant === "neutral" || variant === "loading"
      ? undefined
      : solidStatus) ?? inverseSurface;

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
            <ToastPrimitive.Title
              data-slot="toast-title"
              className={title({ variant })}
            />
            <ToastPrimitive.Description
              data-slot="toast-description"
              className={description({ variant })}
            />
          </div>
        </div>
        {toastItem.actionProps ? (
          <div data-slot="toast-actions" className={actions()}>
            <ToastPrimitive.Action
              data-slot="toast-action"
              className={buttonStyles({
                variant: onFill ? "quiet" : "secondary",
                size: "sm",
                className: action({ onFill }),
              })}
            />
          </div>
        ) : null}
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  );
}

const Toaster = ToastProvider;

export type { ToastProviderProps };
export {
  defaultToastManager as toastManager,
  Toaster,
  ToastPrimitive,
  ToastProvider,
};
