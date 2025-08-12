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

import { Button } from "@dotui/ui/components/button";
import { XIcon } from "@dotui/ui/icons";
import { focusRing } from "@dotui/ui/lib/focus-styles";

const toastStyles = tv({
  slots: {
    region: [
      focusRing(),
      "fixed bottom-4 right-4 z-50 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-hidden outline-none",
    ],
    toast: "bg-bg relative w-[min(380px,90vw)] rounded-lg border p-4 shadow-lg",
    content: "flex flex-col gap-1",
    title: "text-base text-sm",
    description: "text-fg-muted text-sm",
    actions: "",
    close: "absolute right-3 top-3 size-7",
  },
  variants: {
    variant: {
      neutral: { toast: "border-border bg-bg-muted/50" },
      success: {
        toast: "border-border-success bg-bg-success",
        title: "text-fg-success",
      },
      warning: {
        toast: "border-border-warning bg-bg-warning",
      },
      danger: {
        toast: "border-border-danger bg-bg-danger",
      },
      error: {
        toast: "border-border-danger bg-bg-danger",
      },
      info: {
        toast: "border-border-info bg-bg-info",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { region, toast, content, actions, close, title, description } =
  toastStyles();

interface Toast {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

const queue = new AriaToastQueue<Toast>();

const Toaster = () => {
  return (
    <AriaToastRegion queue={queue} className={region()}>
      {({ toast: t }) => (
        <AriaToast toast={t} className={toast({ variant: t.content.variant })}>
          <AriaToastContent className={content()}>
            <Text
              slot="title"
              className={title({ variant: t.content.variant })}
            >
              {t.content.title}
            </Text>
            {t.content.description && (
              <Text slot="description" className={description()}>
                {t.content.description}
              </Text>
            )}
          </AriaToastContent>
          <Button
            slot="close"
            variant="quiet"
            shape="square"
            size="sm"
            aria-label="Close"
            className={close()}
          >
            <XIcon />
          </Button>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
};

interface ToastProps extends AriaToastProps<Toast>, Toast {}
function Toast({
  title: t,
  description: d,
  className,
  variant,
  ...props
}: ToastProps) {
  return (
    <AriaToast
      className={composeRenderProps(className, (className) =>
        toast({ className, variant: variant ?? "neutral" }),
      )}
      {...props}
    >
      <AriaToastContent className={content()}>
        <Text slot="title" className={title()}>
          {t}
        </Text>
        {d ? (
          <Text slot="description" className={description()}>
            {d}
          </Text>
        ) : null}
      </AriaToastContent>
      <div className={actions()}>
        <Button slot="close" className={close()} aria-label="Close">
          ×
        </Button>
      </div>
    </AriaToast>
  );
}

export { Toaster, queue as toast };
