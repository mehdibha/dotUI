"use client";

import type * as React from "react";

import { Button } from "@/components/ui/button";
import { tv, type VariantProps } from "tailwind-variants";
const attachmentVariants = tv({
  slots: {
    root: [
      "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-lg border bg-card text-fg transition-colors",
      "has-[>a,>button]:hover:bg-muted/50",
      "has-[[data-attachment-trigger]:focus-visible]:focus-ring",
      "data-[state=error]:border-border-danger data-[state=idle]:border-dashed",
    ],
    media: [
      "relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-fg **:[svg]:pointer-events-none",
      "group-data-[state=error]/attachment:bg-danger-muted group-data-[state=error]/attachment:text-fg-danger",
      "group-data-[orientation=vertical]/attachment:w-full",
    ],
    content:
      "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
    title: [
      "block max-w-full min-w-0 truncate font-medium",
      "group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
    ],
    description: [
      "mt-0.5 block max-w-full min-w-0 truncate text-fg-muted",
      "group-data-[state=error]/attachment:text-fg-danger",
    ],
    actions: [
      "relative z-20 flex shrink-0 items-center",
      "group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
    ],
    trigger: "absolute inset-0 z-10 cursor-interactive focus-reset",
    group: [
      "flex min-w-0 snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain *:data-attachment:flex-none *:data-attachment:snap-start",
      "scroll-px-1 gap-3 py-1",
    ],
  },
  variants: {
    size: {
      xs: {
        root: "gap-1.5 text-xs has-data-attachment-content:px-1.5 has-data-attachment-content:py-1 has-data-attachment-media:p-1",
        media: "w-7 **:[svg]:not-with-[size]:size-3.5",
        description: "text-xs",
      },
      sm: {
        root: "gap-2.5 text-xs has-data-attachment-content:px-2 has-data-attachment-content:py-1.5 has-data-attachment-media:p-1.5",
        media:
          "w-8 **:[svg]:not-with-[size]:size-4 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
        description: "text-xs",
      },
      md: {
        root: "gap-2 text-sm has-data-attachment-content:px-2.5 has-data-attachment-content:py-2 has-data-attachment-media:p-2",
        media:
          "w-10 **:[svg]:not-with-[size]:size-4 group-data-[orientation=vertical]/attachment:**:[svg]:not-with-[size]:size-6",
        description: "text-xs",
      },
    },
    orientation: {
      horizontal: {
        root: "items-center",
      },
      vertical: {
        root: ["flex-col", "w-24 has-data-attachment-content:w-30"],
      },
    },
    mediaVariant: {
      icon: {},
      image: {
        media: [
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100",
          "*:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
        ],
      },
    },
  },
  defaultVariants: {
    size: "md",
    orientation: "horizontal",
    mediaVariant: "icon",
  },
});

interface AttachmentProps extends React.ComponentProps<"div"> {
  state?: "idle" | "uploading" | "processing" | "error" | "done";
  size?: "xs" | "sm" | "md";
  orientation?: "horizontal" | "vertical";
}

const Attachment = ({
  className,
  state = "done",
  size = "md",
  orientation = "horizontal",
  ...props
}: AttachmentProps) => {
  const { root } = attachmentVariants({ size, orientation });
  return (
    <div
      data-attachment=""
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={root({ className })}
      {...props}
    />
  );
};

interface AttachmentMediaProps extends React.ComponentProps<"div"> {
  variant?: "icon" | "image";
}

const AttachmentMedia = ({
  className,
  variant = "icon",
  ...props
}: AttachmentMediaProps) => {
  const { media } = attachmentVariants({ mediaVariant: variant });
  return (
    <div
      data-attachment-media=""
      data-variant={variant}
      className={media({ className })}
      {...props}
    />
  );
};

interface AttachmentContentProps extends React.ComponentProps<"div"> {}

const AttachmentContent = ({ className, ...props }: AttachmentContentProps) => {
  const { content } = attachmentVariants();
  return (
    <div
      data-attachment-content=""
      className={content({ className })}
      {...props}
    />
  );
};

interface AttachmentTitleProps extends React.ComponentProps<"span"> {}

const AttachmentTitle = ({ className, ...props }: AttachmentTitleProps) => {
  const { title } = attachmentVariants();
  return (
    <span
      data-attachment-title=""
      className={title({ className })}
      {...props}
    />
  );
};

interface AttachmentDescriptionProps extends React.ComponentProps<"span"> {}

const AttachmentDescription = ({
  className,
  ...props
}: AttachmentDescriptionProps) => {
  const { description } = attachmentVariants();
  return (
    <span
      data-attachment-description=""
      className={description({ className })}
      {...props}
    />
  );
};

interface AttachmentActionsProps extends React.ComponentProps<"div"> {}

const AttachmentActions = ({ className, ...props }: AttachmentActionsProps) => {
  const { actions } = attachmentVariants();
  return (
    <div
      data-attachment-actions=""
      className={actions({ className })}
      {...props}
    />
  );
};

interface AttachmentActionProps extends React.ComponentProps<typeof Button> {}

const AttachmentAction = ({
  variant = "quiet",
  size = "xs",
  ...props
}: AttachmentActionProps) => {
  return (
    <Button
      data-attachment-action=""
      variant={variant}
      size={size}
      isIconOnly
      {...props}
    />
  );
};

interface AttachmentTriggerProps extends React.ComponentProps<"button"> {}

const AttachmentTrigger = ({
  className,
  type = "button",
  ...props
}: AttachmentTriggerProps) => {
  const { trigger } = attachmentVariants();
  return (
    <button
      data-attachment-trigger=""
      type={type}
      className={trigger({ className })}
      {...props}
    />
  );
};

interface AttachmentGroupProps extends React.ComponentProps<"div"> {}

const AttachmentGroup = ({ className, ...props }: AttachmentGroupProps) => {
  const { group } = attachmentVariants();
  return (
    <div data-attachment-group="" className={group({ className })} {...props} />
  );
};

export type {
  AttachmentActionProps,
  AttachmentActionsProps,
  AttachmentContentProps,
  AttachmentDescriptionProps,
  AttachmentGroupProps,
  AttachmentMediaProps,
  AttachmentProps,
  AttachmentTitleProps,
  AttachmentTriggerProps,
};
export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
};
