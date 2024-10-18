"use client";

import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components";
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Tag as AriaTag,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "@/registry/ui/default/core/button";
import { Field } from "@/registry/ui/default/core/field";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { cn } from "../../lib/cn";
import { toggleButtonStyles } from "../toggle-button";

const tagGroupStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
    list: "flex flex-wrap gap-1",
    tag: [focusRing(), "bg-bg-muted rounded-md px-2 py-1 text-sm"],
  },
});

const { root, list, tag } = tagGroupStyles();

interface TagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  contextualHelp?: React.ReactNode;
}

function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  contextualHelp,
  className,
  ...props
}: TagGroupProps<T>) {
  return (
    <AriaTagGroup className={root({ className })} {...props}>
      <Field
        label={label}
        description={description}
        errorMessage={errorMessage}
        contextualHelp={contextualHelp}
      >
        <AriaTagList
          className={list()}
          items={items}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </AriaTagList>
      </Field>
    </AriaTagGroup>
  );
}

interface TagProps extends AriaTagProps {}

function Tag({ children, ...props }: TagProps) {
  let textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={toggleButtonStyles({
        variant: "outline",
        shape: "rectangle",
        // size: "sm",
        className: cn("cursor-pointer", props.className),
      })}
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && <Button slot="remove">ⓧ</Button>}
        </>
      )}
    </AriaTag>
  );
}

export { TagGroup, Tag };
export type { TagGroupProps, TagProps };
