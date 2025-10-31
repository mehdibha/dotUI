"use client";

import { XIcon } from "lucide-react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@dotui/registry/ui/button";

const tagGroupStyles = tv({
  slots: {
    group: "flex flex-col items-start gap-2",
    list: "flex w-full flex-wrap gap-1",
    tag: [
      "focus-reset focus-visible:focus-ring",
      "focus-reset focus-visible:focus-ring ring-offset-background inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-fg-disabled",
    ],
  },
});

const { group, list, tag } = tagGroupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TagGroupProps extends AriaTagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
  return <AriaTagGroup {...props} className={group({ className })} />;
}

/* -----------------------------------------------------------------------------------------------*/

interface TagListProps<T> extends AriaTagListProps<T> {}

function TagList<T extends object>(props: TagListProps<T>) {
  return (
    <AriaTagList
      {...props}
      className={composeRenderProps(props.className, (className) =>
        list({ className }),
      )}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TagProps extends AriaTagProps {}

function Tag({ className, ...props }: TagProps) {
  const textValue =
    typeof props.children === "string" ? props.children : undefined;

  return (
    <AriaTag
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        tag({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button variant="quiet" slot="remove">
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </AriaTag>
  );
}

/* -----------------------------------------------------------------------------------------------*/

export { TagGroup, TagList, Tag };

export type { TagProps, TagGroupProps, TagListProps };
