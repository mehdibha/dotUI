"use client";

import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
const messageVariants = tv({
  slots: {
    group: ["flex min-w-0 flex-col", "gap-2"],
    root: [
      "group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
      "gap-2 text-sm",
    ],
    avatar:
      "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-[[data-message-footer]]/message:-translate-y-8",
    content: [
      "flex w-full min-w-0 flex-col wrap-break-word",
      "group-data-[align=end]/message:*:self-end",
      "gap-2.5",
    ],
    header: [
      "flex max-w-full min-w-0 items-center font-medium text-fg-muted",
      "group-has-[[data-variant=ghost]]/message:px-0",
      "px-3 text-xs",
    ],
    footer: [
      "flex max-w-full min-w-0 items-center font-medium text-fg-muted",
      "group-data-[align=end]/message:justify-end",
      "group-has-[[data-variant=ghost]]/message:px-0",
      "px-3 text-xs",
    ],
  },
});

interface MessageGroupProps extends React.ComponentProps<"div"> {}

const MessageGroup = ({ className, ...props }: MessageGroupProps) => {
  const { group } = messageVariants();
  return (
    <div data-message-group="" className={group({ className })} {...props} />
  );
};

interface MessageProps extends React.ComponentProps<"div"> {
  align?: "start" | "end";
}

const Message = ({ className, align = "start", ...props }: MessageProps) => {
  const { root } = messageVariants();
  return (
    <div
      data-message=""
      data-align={align}
      className={root({ className })}
      {...props}
    />
  );
};

interface MessageAvatarProps extends React.ComponentProps<"div"> {}

const MessageAvatar = ({ className, ...props }: MessageAvatarProps) => {
  const { avatar } = messageVariants();
  return (
    <div data-message-avatar="" className={avatar({ className })} {...props} />
  );
};

interface MessageContentProps extends React.ComponentProps<"div"> {}

const MessageContent = ({ className, ...props }: MessageContentProps) => {
  const { content } = messageVariants();
  return (
    <div
      data-message-content=""
      className={content({ className })}
      {...props}
    />
  );
};

interface MessageHeaderProps extends React.ComponentProps<"div"> {}

const MessageHeader = ({ className, ...props }: MessageHeaderProps) => {
  const { header } = messageVariants();
  return (
    <div data-message-header="" className={header({ className })} {...props} />
  );
};

interface MessageFooterProps extends React.ComponentProps<"div"> {}

const MessageFooter = ({ className, ...props }: MessageFooterProps) => {
  const { footer } = messageVariants();
  return (
    <div data-message-footer="" className={footer({ className })} {...props} />
  );
};

export type {
  MessageAvatarProps,
  MessageContentProps,
  MessageFooterProps,
  MessageGroupProps,
  MessageHeaderProps,
  MessageProps,
};
export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
};
