"use client";

import type { FieldProps } from "@/registry/ui/field.basic";
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components";
import React from "react";
import { focusRing } from "@/registry/lib/focus-styles";
import { Button } from "@/registry/ui/button.basic";
import { HelpText, Label } from "@/registry/ui/field.basic";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  composeRenderProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const tagGroupStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
    list: "flex w-full flex-wrap gap-1",
  },
});

const { root, list } = tagGroupStyles();

const tagStyles = tv({
  extend: focusRing,
  base: "ring-offset-background disabled:bg-bg-disabled disabled:text-fg-disabled inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-colors disabled:cursor-default",
  variants: {
    variant: {
      default:
        "bg-bg-neutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active text-fg-onNeutral selected:bg-bg-primary selected:text-fg-onPrimary",
      quiet:
        "hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 text-fg selected:bg-bg-primary selected:text-fg-onPrimary bg-transparent",
      outline:
        "border-border-field bg-bg-inverse/5 hover:bg-bg-inverse/10 pressed:bg-bg-inverse/15 pressed:border-transparent text-fg selected:bg-bg-primary selected:border-transparent selected:text-fg-onPrimary border",
      accent:
        "border-border-field hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 pressed:border-transparent text-fg selected:bg-bg-accent selected:border-transparent selected:hover:bg-bg-accent-hover selected:pressed:bg-bg-accent-active selected:text-fg-onAccent border bg-transparent",
    },
    size: {
      sm: "size-8 [&_svg]:size-4",
      md: "size-9 [&_svg]:size-4",
      lg: "size-10 [&_svg]:size-5",
    },
    shape: {
      rectangle: "",
      square: "",
      circle: "rounded-full",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      shape: "rectangle",
      className: "w-auto px-3",
    },
    {
      size: "md",
      shape: "rectangle",
      className: "w-auto px-4",
    },
    {
      size: "lg",
      shape: "rectangle",
      className: "w-auto px-5",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    shape: "rectangle",
  },
});

interface TagGroupProps<T>
  extends Omit<TagGroupRootProps, "children">,
    Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState">,
    FieldProps {}

function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: TagGroupProps<T>) {
  return (
    <TagGroupRoot {...props}>
      {label && <Label>{label}</Label>}
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      <HelpText description={description} errorMessage={errorMessage} />
    </TagGroupRoot>
  );
}

interface TagGroupRootProps
  extends AriaTagGroupProps,
    VariantProps<typeof tagStyles> {}
function TagGroupRoot({
  className,
  variant,
  size,
  shape,
  ...props
}: TagGroupRootProps) {
  return (
    <TagGroupContext.Provider value={{ variant, size, shape }}>
      <AriaTagGroup {...props} className={root({ className })} />
    </TagGroupContext.Provider>
  );
}

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

interface TagProps extends AriaTagProps, VariantProps<typeof tagStyles> {}
function Tag(localProps: TagProps) {
  const contextProps = useTagGroupContext();
  const props = { ...contextProps, ...localProps };
  const { children, variant, size, shape, className, ...restProps } = props;
  const textValue =
    typeof props.children === "string" ? props.children : undefined;
  return (
    <AriaTag
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        tagStyles({ variant, size, shape, className }),
      )}
      {...restProps}
    >
      {composeRenderProps(children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && <Button slot="remove">ⓧ</Button>}
        </>
      ))}
    </AriaTag>
  );
}

type TagGroupContextValue = VariantProps<typeof tagGroupStyles>;
const TagGroupContext = React.createContext<TagGroupContextValue>({});
const useTagGroupContext = () => {
  return React.useContext(TagGroupContext);
};

export { TagGroup, Tag };
export type { TagGroupProps, TagProps };
