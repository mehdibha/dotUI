"use client";

import type * as React from "react";
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller";

import { ArrowDownIcon } from "lucide-react";
import { buttonStyles as useButtonStyles } from "@/components/ui/button";
import { tv, type VariantProps } from "tailwind-variants";
const messageScrollerVariants = tv({
  slots: {
    root: "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
    viewport:
      "size-full min-h-0 min-w-0 [scrollbar-width:thin] overflow-y-auto overscroll-contain contain-content",
    content: ["flex h-max min-h-full flex-col", "gap-6"],
    item: "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
    button: [
      "absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
      "transition-[translate,scale,opacity] duration-200",
      "data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)]",
      "data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)]",
      "data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full",
      "data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=start]:*:[svg]:rotate-180",
    ],
  },
});

interface MessageScrollerProviderProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Provider
> {}

const MessageScrollerProvider = (props: MessageScrollerProviderProps) => {
  return <MessageScrollerPrimitive.Provider {...props} />;
};

interface MessageScrollerProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Root
> {}

const MessageScroller = ({ className, ...props }: MessageScrollerProps) => {
  const { root } = messageScrollerVariants();
  return (
    <MessageScrollerPrimitive.Root
      data-message-scroller=""
      className={root({ className })}
      {...props}
    />
  );
};

interface MessageScrollerViewportProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Viewport
> {}

const MessageScrollerViewport = ({
  className,
  ...props
}: MessageScrollerViewportProps) => {
  const { viewport } = messageScrollerVariants();
  return (
    <MessageScrollerPrimitive.Viewport
      data-message-scroller-viewport=""
      className={viewport({ className })}
      {...props}
    />
  );
};

interface MessageScrollerContentProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Content
> {}

const MessageScrollerContent = ({
  className,
  ...props
}: MessageScrollerContentProps) => {
  const { content } = messageScrollerVariants();
  return (
    <MessageScrollerPrimitive.Content
      data-message-scroller-content=""
      className={content({ className })}
      {...props}
    />
  );
};

interface MessageScrollerItemProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
> {}

const MessageScrollerItem = ({
  className,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) => {
  const { item } = messageScrollerVariants();
  return (
    <MessageScrollerPrimitive.Item
      data-message-scroller-item=""
      scrollAnchor={scrollAnchor}
      className={item({ className })}
      {...props}
    />
  );
};

interface MessageScrollerButtonProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> {}

const MessageScrollerButton = ({
  className,
  children,
  direction = "end",
  ...props
}: MessageScrollerButtonProps) => {
  const { button } = messageScrollerVariants();
  const buttonStyles = useButtonStyles;
  return (
    <MessageScrollerPrimitive.Button
      data-message-scroller-button=""
      data-button=""
      data-icon-only=""
      data-direction={direction}
      direction={direction}
      className={buttonStyles({
        variant: "secondary",
        size: "sm",
        isIconOnly: true,
        className: button({ className }),
      })}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  );
};

export type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerViewportProps,
};
export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
