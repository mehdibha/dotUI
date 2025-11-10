"use client";

import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  composeRenderProps,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { ToastProps as AriaToastProps } from "react-aria-components";

const toastStyles = tv({
  slots: {
    region: [
      "focus-reset focus-visible:focus-ring",
      "fixed right-4 bottom-4 z-50 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-hidden outline-none",
    ],
    toast: "relative w-[min(380px,90vw)] rounded-lg border bg-bg p-4 shadow-lg",
    content: "flex flex-col gap-1",
    title: "text-base",
    description: "text-sm text-fg-muted",
    actions: "",
    close: "absolute top-3.5 right-3 size-7",
  },
  variants: {
    variant: {
      neutral: { toast: "border-border bg-card" },
      success: {
        toast: "border-border-success bg-success",
        title: "text-fg-success",
      },
      warning: {
        toast: "border-border-warning bg-warning",
      },
      danger: {
        toast: "border-border-danger bg-danger",
      },
      error: {
        toast: "border-border-danger bg-danger",
      },
      info: {
        toast: "border-border-info bg-info",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { region, toast, content, actions, title, description } = toastStyles();

interface Toast {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

const queue = new AriaToastQueue<Toast>();

const Toaster = () => {
  return (
    <AriaToastRegion queue={queue} className={region()}>
      {({ toast }) => <Toast toast={toast} />}
    </AriaToastRegion>
  );
};

interface ToastProps extends AriaToastProps<Toast> {}

function Toast({ className, ...props }: ToastProps) {
  return (
    <AriaToast
      className={composeRenderProps(className, (className) =>
        toast({ className, variant: props.toast.content.variant }),
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

export { Toaster, queue as toast };
