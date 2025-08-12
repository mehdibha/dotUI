"use client";

import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  Button,
  composeRenderProps,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ToastProps as AriaToastProps,
  ToastRegionProps as AriaToastRegionProps,
} from "react-aria-components";

import { focusRing } from "@dotui/ui/lib/focus-styles";

const toastStyles = tv({
  slots: {
    region: [
      focusRing(),
      "fixed bottom-4 right-4 z-50 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-hidden outline-none",
    ],
    toast: "pointer-events-auto w-[min(380px,90vw)] rounded-lg border bg-bg p-4 shadow-lg",
    content: "text-sm",
    actions: "ml-4 flex shrink-0 items-start gap-2",
    close: "inline-flex size-6 items-center justify-center rounded-md text-fg-muted hover:text-fg",
    title: "text-sm font-medium leading-none",
    description: "mt-1 text-xs text-fg-muted",
  },
  variants: {
    variant: {
      neutral: { toast: "border-border" },
      success: {
        toast:
          "border-border-success bg-bg-success-muted/70 text-fg-success backdrop-blur-sm",
      },
      warning: {
        toast:
          "border-border-warning bg-bg-warning-muted/70 text-fg-warning backdrop-blur-sm",
      },
      danger: {
        toast:
          "border-border-danger bg-bg-danger-muted/70 text-fg-danger backdrop-blur-sm",
      },
      error: {
        toast:
          "border-border-danger bg-bg-danger-muted/70 text-fg-danger backdrop-blur-sm",
      },
      info: {
        toast:
          "border-border-info bg-bg-info-muted/70 text-fg-info backdrop-blur-sm",
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
        <AriaToast
          toast={t}
          className={toast({ variant: t.content.variant ?? "neutral" })}
        >
          <AriaToastContent className={content()}>
            <Text slot="title" className={title()}>
              {t.content.title}
            </Text>
            {t.content.description ? (
              <Text slot="description" className={description()}>
                {t.content.description}
              </Text>
            ) : null}
          </AriaToastContent>
          <div className={actions()}>
            <Button slot="close" className={close()} aria-label="Close">
              ×
            </Button>
          </div>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
};

interface ToastRegionProps extends AriaToastRegionProps<Toast> {}
function ToastRegion({ className, ...props }: ToastRegionProps) {
  return (
    <AriaToastRegion
      className={composeRenderProps(className, (className) => region({ className }))}
      {...props}
    />
  );
}

interface ToastProps extends AriaToastProps<Toast>, Toast {}
function Toast({ title: t, description: d, className, variant, ...props }: ToastProps) {
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
