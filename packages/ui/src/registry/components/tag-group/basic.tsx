"use client";

import React from "react";
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

import { Button } from "@dotui/ui/components/button";
import { HelpText, Label } from "@dotui/ui/components/field";
import { focusRing } from "@dotui/ui/lib/focus-styles";
import type { FieldProps } from "@dotui/ui/components/field";

const tagGroupStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
    list: "flex w-full flex-wrap gap-1",
  },
});

const { root, list } = tagGroupStyles();

const tagStyles = tv({
  extend: focusRing,
  base: "ring-offset-background inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-normal font-medium transition-colors disabled:cursor-default disabled:bg-bg-disabled disabled:text-fg-disabled",
  variants: {
    variant: {
      default:
        "bg-bg-neutral text-fg-on-neutral hover:bg-bg-neutral-hover pressed:bg-bg-neutral-active selected:bg-bg-primary selected:text-fg-on-primary",
      quiet:
        "bg-transparent text-fg hover:bg-bg-inverse/10 pressed:bg-bg-inverse/20 selected:bg-bg-primary selected:text-fg-on-primary",
      outline:
        "border border-border-field bg-bg-inverse/5 text-fg hover:bg-bg-inverse/10 pressed:border-transparent pressed:bg-bg-inverse/15 selected:border-transparent selected:bg-bg-primary selected:text-fg-on-primary",
      accent:
        "border border-border-field bg-transparent text-fg hover:bg-bg-inverse/10 pressed:border-transparent pressed:bg-bg-inverse/20 selected:border-transparent selected:bg-bg-accent selected:text-fg-on-accent selected:hover:bg-bg-accent-hover selected:pressed:bg-bg-accent-active",
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
