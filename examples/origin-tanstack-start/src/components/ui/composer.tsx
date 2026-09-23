"use client";

import * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TextAreaPrimitive from "react-aria-components/TextArea";
import { mergeRefs } from "react-aria/mergeRefs";
import { useLayoutEffect } from "react-aria/private/utils/useLayoutEffect";
import { useControlledState } from "react-stately/useControlledState";

import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { tv } from "tailwind-variants";

const composerVariants = tv({
  slots: {
    root: "flex w-full cursor-text flex-col rounded-lg border border-border bg-card text-fg shadow-(--shadow-card,0_0_#0000) transition-[border-color,box-shadow] has-focus-visible:border-border-control gap-1.5 p-2 text-sm",
    textArea:
      "max-h-48 w-full resize-none bg-transparent outline-none placeholder:text-fg-muted disabled:cursor-disabled min-h-10 px-2 py-1.5",
    toolbar: "flex items-center gap-1.5",
    submit: "ms-auto",
  },
});

const { root, textArea, toolbar, submit } = composerVariants();

type ComposerStatus = "idle" | "submitted" | "streaming";

interface ComposerContextValue {
  value: string;
  setValue: (value: string) => void;
  isEmpty: boolean;
  isDisabled: boolean;
  status: ComposerStatus;
  submit: () => void;
  stop?: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null);

function useComposer() {
  const context = React.use(ComposerContext);
  if (!context) throw new Error("useComposer must be used within a Composer");
  return context;
}

/**
 * Focus the text area without letting iOS pan the page to reveal it: a
 * composer pinned to the bottom sits under the keyboard's final position, so
 * WebKit scrolls the whole page up while the keyboard animates, then the page
 * snaps back. Focusing while the field is painted far above the viewport (for
 * this one synchronous call, never rendered) gives WebKit nothing to reveal.
 * Base UI's drawer keyboard provider uses the same technique.
 */
function focusWithoutPan(input: HTMLTextAreaElement) {
  const { opacity, transform, transition } = input.style;
  input.style.transition = "none";
  input.style.opacity = "0";
  input.style.transform = "translateY(-2000px)";
  try {
    input.focus({ preventScroll: true });
  } finally {
    input.style.opacity = opacity;
    input.style.transform = transform;
    input.style.transition = transition;
  }
}

/* -------------------------------------------------------------------------- */

interface ComposerProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  status?: ComposerStatus;
  isDisabled?: boolean;
}

function Composer({
  className,
  value: valueProp,
  defaultValue = "",
  onChange,
  onSubmit,
  onStop,
  status = "idle",
  isDisabled = false,
  children,
  ...props
}: ComposerProps) {
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue,
    onChange,
  );
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);
  const isEmpty = value.trim() === "";

  const submit = () => {
    if (isEmpty || isDisabled || status !== "idle") return;
    onSubmit?.(value);
    setValue("");
  };

  return (
    <ComposerContext.Provider
      value={{
        value,
        setValue,
        isEmpty,
        isDisabled,
        status,
        submit,
        stop: onStop,
        textAreaRef,
      }}
    >
      <form
        data-composer=""
        data-status={status}
        className={root({ className })}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") return;
          const target = event.target as HTMLElement;
          if (target.closest("button,a,input,textarea,[role='button']")) return;
          event.preventDefault();
          textAreaRef.current?.focus();
        }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = touch
            ? { x: touch.clientX, y: touch.clientY }
            : null;
        }}
        onTouchEnd={(event) => {
          const input = textAreaRef.current;
          const touch = event.changedTouches[0];
          const start = touchStart.current;
          touchStart.current = null;
          if (!input || !touch || !start || isDisabled) return;
          if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10)
            return;
          const target = event.target as HTMLElement;
          if (target.closest("button,a,input,[role='button']")) return;
          // Already focused: let the tap place the caret.
          if (document.activeElement === input) return;
          event.preventDefault();
          focusWithoutPan(input);
        }}
        {...props}
      >
        {children}
      </form>
    </ComposerContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

interface ComposerTextAreaProps extends Omit<
  React.ComponentProps<typeof TextAreaPrimitive.TextArea>,
  "value" | "defaultValue" | "onChange"
> {}

function ComposerTextArea({
  ref,
  className,
  onKeyDown,
  ...props
}: ComposerTextAreaProps) {
  const { value, setValue, submit, isDisabled, textAreaRef } = useComposer();

  // Grow with the content; the max-height class caps it and the rest scrolls.
  useLayoutEffect(() => {
    const input = textAreaRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
  }, [value, textAreaRef]);

  return (
    <TextAreaPrimitive.TextArea
      ref={mergeRefs(textAreaRef, ref as React.Ref<HTMLTextAreaElement>)}
      data-slot="composer-textarea"
      rows={1}
      value={value}
      disabled={isDisabled}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        // Enter sends on a keyboard; touch keyboards keep Return for new lines.
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing &&
          !coarse
        ) {
          event.preventDefault();
          submit();
        }
      }}
      className={composeRenderProps(className, (cn) =>
        textArea({ className: cn }),
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface ComposerToolbarProps extends React.ComponentProps<"div"> {}

function ComposerToolbar({ className, ...props }: ComposerToolbarProps) {
  return (
    <div
      data-slot="composer-toolbar"
      className={toolbar({ className })}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface ComposerSubmitProps extends ButtonProps {}

function ComposerSubmit({
  className,
  children,
  onPress,
  ...props
}: ComposerSubmitProps) {
  const { isEmpty, isDisabled, status, stop } = useComposer();
  const busy = status !== "idle";

  return (
    <Button
      data-slot="composer-submit"
      type={busy ? "button" : "submit"}
      variant="primary"
      isIconOnly
      aria-label={busy ? "Stop" : "Send"}
      // Keep focus (and the software keyboard) in the text area: a blur
      // would close the keyboard and shift the layout mid-tap.
      preventFocusOnPress
      isDisabled={isDisabled || (busy ? !stop : isEmpty)}
      onPress={(event) => {
        onPress?.(event);
        if (busy) stop?.();
      }}
      className={composeRenderProps(className, (cn) =>
        submit({ className: cn }),
      )}
      {...props}
    >
      {children ??
        (busy ? <SquareIcon className="fill-current" /> : <ArrowUpIcon />)}
    </Button>
  );
}

export type {
  ComposerProps,
  ComposerStatus,
  ComposerSubmitProps,
  ComposerTextAreaProps,
  ComposerToolbarProps,
};
export {
  Composer,
  ComposerSubmit,
  ComposerTextArea,
  ComposerToolbar,
  useComposer,
};
