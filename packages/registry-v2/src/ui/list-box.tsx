"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  ListBoxSection as AriaListBoxSection,
  composeRenderProps,
  ListStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { focusRing } from "@dotui/registry-v2/lib/focus-styles";
import { Loader } from "@dotui/registry-v2/ui/loader";
import { Text } from "@dotui/registry-v2/ui/text";

const listboxStyles = tv({
  slots: {
    root: [
      focusRing(),
      // "data-standalone:max-h-68 data-standalone:w-48 data-standalone:overflow-y-auto data-standalone:rounded-md data-standalone:border data-standalone:bg-card data-standalone:p-1 data-standalone:shadow-sm",
      "w-full p-1",
    ],
    item: [
      "relative flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:**:text-fg-disabled",
      "selection-single:pr-4 selection-multiple:pr-4",
    ],
    section: "",
    sectionTitle: "",
  },
  variants: {
    variant: {
      default: { item: "" },
      success: {
        item: "",
      },
      warning: {
        item: "",
      },
      danger: {
        item: "",
      },
    },
  },
});

const { root, item, section, sectionTitle } = listboxStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxProps<T> extends AriaListBoxProps<T> {}

const ListBox = <T extends object>({
  className,
  ...props
}: ListBoxProps<T>) => {
  const standalone = !React.use(ListStateContext);
  return (
    <AriaListBox
      data-standalone={standalone || undefined}
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxItemProps<T>
  extends AriaListBoxItemProps<T>,
    VariantProps<typeof listboxStyles> {}

const ListBoxItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue =
    textValueProp ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <AriaListBoxItem
      textValue={textValue}
      className={composeRenderProps(className, (cn) =>
        item({ className: cn, variant }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected }) => (
          <>
            {children}
            {selectionMode !== "none" && (
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                {isSelected && <CheckIcon className="size-4" />}
              </span>
            )}
          </>
        ),
      )}
    </AriaListBoxItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {}

const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return <AriaListBoxSection className={section({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxSectionTitleProps
  extends React.ComponentProps<typeof AriaHeader> {}

const ListBoxSectionTitle = ({
  className,
  ...props
}: ListBoxSectionTitleProps) => {
  return <AriaHeader className={sectionTitle({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundListBox = Object.assign(ListBox, {
  Item: ListBoxItem,
  Section: ListBoxSection,
  Title: ListBoxSectionTitle,
});

export {
  CompoundListBox as ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionTitle,
};

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps };
