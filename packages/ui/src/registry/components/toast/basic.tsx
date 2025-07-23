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
      "fixed bottom-4 right-4 flex flex-col-reverse gap-2 outline-none",
    ],
    toast: "",
    content: "",
    actions: "",
  },
  variants: {},
  defaultVariants: {},
});

const { region, toast, content, actions } = toastStyles();

interface Toast {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info";
}

const queue = new AriaToastQueue<Toast>();

const Toaster = () => {
  return (
    <AriaToastRegion
      queue={queue}
      className="size-100 fixed bottom-4 right-4 bg-red-500"
    >
      {({ toast }) => (
        <AriaToast toast={toast} className="bg-blue-500 p-2">
          <AriaToastContent className="bg-amber-400">
            <Text slot="title">{toast.content.title}</Text>
            <Text slot="description">{toast.content.description}</Text>
          </AriaToastContent>
          <Button slot="close">x</Button>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
};

interface ToastRegionProps extends AriaToastRegionProps<Toast> {}
function ToastRegion({ className, ...props }: ToastRegionProps) {
  return (
    <AriaToastRegion
      className={composeRenderProps(className, (className) =>
        region({ className }),
      )}
      {...props}
    />
  );
}

interface ToastProps extends AriaToastProps<Toast>, Toast {}
function Toast({ title, description, className, ...props }: ToastProps) {
  return (
    <AriaToast
      className={composeRenderProps(className, (className) =>
        toast({ className }),
      )}
      {...props}
    >
      <AriaToastContent>
        <Text slot="title">{title}</Text>
        <Text slot="description">{description}</Text>
      </AriaToastContent>
      <Button slot="close">x</Button>
    </AriaToast>
  );
}

export { Toaster, queue as toast };
