"use client";

import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
const bubbleVariants = tv({
  slots: {
    group: ["flex min-w-0 flex-col", "gap-2"],
    root: [
      "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1",
      "group-data-[align=end]/message:self-end data-[align=end]:self-end",
    ],
    content: [
      "w-fit max-w-full min-w-0 overflow-hidden rounded-lg border border-transparent wrap-break-word",
      "group-data-[align=end]/bubble:self-end",
      "px-3 py-2 text-sm leading-relaxed",
    ],
    reactions: [
      "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 ring-bg has-[button]:p-0 data-[align=end]:right-3 data-[align=start]:left-3 data-[side=bottom]:bottom-0 data-[side=bottom]:translate-y-3/4 data-[side=top]:top-0 data-[side=top]:-translate-y-3/4",
      "text-sm ring-3",
    ],
  },
  variants: {
    variant: {
      primary: {
        root: "*:data-bubble-content:bg-primary *:data-bubble-content:text-fg-on-primary",
      },
      neutral: {
        root: "*:data-bubble-content:bg-neutral *:data-bubble-content:text-fg-on-neutral",
      },
      muted: {
        root: "*:data-bubble-content:bg-muted",
      },
      tinted: {
        root: "*:data-bubble-content:bg-primary-muted",
      },
      outline: {
        root: "*:data-bubble-content:border-border *:data-bubble-content:bg-bg",
      },
      ghost: {
        root: "max-w-full *:data-bubble-content:rounded-none *:data-bubble-content:border-none *:data-bubble-content:bg-transparent *:data-bubble-content:p-0",
      },
      danger: {
        root: "*:data-bubble-content:bg-danger-muted *:data-bubble-content:text-fg-danger",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface BubbleGroupProps extends React.ComponentProps<"div"> {}

const BubbleGroup = ({ className, ...props }: BubbleGroupProps) => {
  const { group } = bubbleVariants();
  return (
    <div data-bubble-group="" className={group({ className })} {...props} />
  );
};

interface BubbleProps extends React.ComponentProps<"div"> {
  variant?:
    | "primary"
    | "neutral"
    | "muted"
    | "tinted"
    | "outline"
    | "ghost"
    | "danger";
  align?: "start" | "end";
}

const Bubble = ({
  className,
  variant = "primary",
  align = "start",
  ...props
}: BubbleProps) => {
  const { root } = bubbleVariants({ variant });
  return (
    <div
      data-bubble=""
      data-variant={variant}
      data-align={align}
      className={root({ className })}
      {...props}
    />
  );
};

interface BubbleContentProps extends React.ComponentProps<"div"> {}

const BubbleContent = ({ className, ...props }: BubbleContentProps) => {
  const { content } = bubbleVariants();
  return (
    <div data-bubble-content="" className={content({ className })} {...props} />
  );
};

interface BubbleReactionsProps extends React.ComponentProps<"div"> {
  side?: "top" | "bottom";
  align?: "start" | "end";
}

const BubbleReactions = ({
  className,
  side = "bottom",
  align = "end",
  ...props
}: BubbleReactionsProps) => {
  const { reactions } = bubbleVariants();
  return (
    <div
      data-bubble-reactions=""
      data-side={side}
      data-align={align}
      className={reactions({ className })}
      {...props}
    />
  );
};

export type {
  BubbleContentProps,
  BubbleGroupProps,
  BubbleProps,
  BubbleReactionsProps,
};
export { Bubble, BubbleContent, BubbleGroup, BubbleReactions };
