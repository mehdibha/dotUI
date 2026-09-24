"use client";

import type React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as GridListPrimitive from "react-aria-components/GridList";
import { type VariantProps, tv } from "tailwind-variants";

import { CheckIcon, ChevronRightIcon } from "lucide-react";

const listVariants = tv({
  slots: {
    root: "flex flex-col outline-hidden text-sm",
    item: "relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] content-center items-center px-(--list-px) text-fg outline-hidden select-ui [--list-separator:var(--list-px)] has-data-[slot=list-item-icon]:[--list-separator:calc(var(--list-px)+var(--list-icon)+--spacing(3))] *:[[role=gridcell]]:contents after:pointer-events-none after:absolute after:start-(--list-separator) after:end-0 after:bottom-0 after:h-px after:bg-border [&:not(:has(+[data-list-item]))]:after:hidden hover:cursor-interactive hover:bg-highlight focus-visible:bg-highlight disabled:text-(--disabled-fg,var(--color-fg-disabled)) disabled:**:text-current pressed:bg-highlight min-h-10 py-2 [--list-icon:--spacing(4)] [--list-px:--spacing(3)] bg-card first:rounded-t-lg [&:not(:has(+[data-list-item]))]:rounded-b-lg [:not([data-list-item])+&]:rounded-t-lg",
    itemIcon:
      "col-start-1 row-span-2 row-start-1 me-3 flex items-center justify-center text-fg-muted *:[svg]:size-(--list-icon) *:[svg]:shrink-0",
    itemLabel:
      "col-start-2 row-start-1 truncate [&:not(:has(~[data-slot=list-item-description]))]:row-span-2 [&:not(:has(~[data-slot=list-item-description]))]:self-center",
    itemDescription: "col-start-2 row-start-2 text-fg-muted text-xs",
    itemValue:
      "col-start-3 row-span-2 row-start-1 ms-3 flex items-center gap-2 text-fg-muted",
    itemAccessory:
      "col-start-4 row-span-2 row-start-1 ms-2 flex items-center *:[svg]:size-(--list-icon)",
    chevron: "text-fg-muted opacity-60",
    check: "text-selection",
    section: "flex flex-col [[data-list-section]+&]:mt-8",
    sectionHeader: "px-(--list-px) pb-2 text-fg-muted text-xs",
  },
  variants: {
    variant: {
      default: {},
      accent: {
        item: "text-fg-accent",
        itemIcon: "text-fg-accent",
      },
      danger: {
        item: "text-fg-danger",
        itemIcon: "text-fg-danger",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const {
  root,
  item,
  itemAccessory,
  chevron,
  check,
  itemIcon,
  itemLabel,
  itemDescription,
  itemValue,
  section,
  sectionHeader,
} = listVariants();

interface ListProps<T> extends GridListPrimitive.GridListProps<T> {}

const List = <T extends object>({ className, ...props }: ListProps<T>) => {
  return (
    <GridListPrimitive.GridList
      data-list=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListItemProps<T>
  extends
    GridListPrimitive.GridListItemProps<T>,
    VariantProps<typeof listVariants> {
  hasChevron?: boolean;
}

const ListItem = <T extends object>({
  className,
  variant,
  hasChevron,
  textValue: textValueProp,
  ...props
}: ListItemProps<T>) => {
  const textValue =
    textValueProp ??
    (typeof props.children === "string" ? props.children : undefined);
  const showChevron = hasChevron ?? props.href !== undefined;

  return (
    <GridListPrimitive.GridListItem
      data-list-item=""
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
            {typeof children === "string" ? (
              <ListItemLabel>{children}</ListItemLabel>
            ) : (
              children
            )}
            {(showChevron || (selectionMode !== "none" && isSelected)) && (
              <span data-slot="list-item-accessory" className={itemAccessory()}>
                {selectionMode !== "none" && isSelected ? (
                  <CheckIcon className={check()} />
                ) : (
                  <ChevronRightIcon className={chevron()} />
                )}
              </span>
            )}
          </>
        ),
      )}
    </GridListPrimitive.GridListItem>
  );
};

/* -------------------------------------------------------------------------- */

interface ListItemIconProps extends React.ComponentProps<"span"> {}

const ListItemIcon = ({ className, ...props }: ListItemIconProps) => {
  return (
    <span
      data-slot="list-item-icon"
      className={itemIcon({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListItemLabelProps extends React.ComponentProps<"span"> {}

const ListItemLabel = ({ className, ...props }: ListItemLabelProps) => {
  return (
    <span
      data-slot="list-item-label"
      className={itemLabel({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListItemDescriptionProps extends React.ComponentProps<"span"> {}

const ListItemDescription = ({
  className,
  ...props
}: ListItemDescriptionProps) => {
  return (
    <span
      data-slot="list-item-description"
      className={itemDescription({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListItemValueProps extends React.ComponentProps<"span"> {}

const ListItemValue = ({ className, ...props }: ListItemValueProps) => {
  return (
    <span
      data-slot="list-item-value"
      className={itemValue({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListSectionProps<
  T,
> extends GridListPrimitive.GridListSectionProps<T> {}

const ListSection = <T extends object>({
  className,
  ...props
}: ListSectionProps<T>) => {
  return (
    <GridListPrimitive.GridListSection
      data-list-section=""
      className={section({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListSectionHeaderProps extends React.ComponentProps<
  typeof GridListPrimitive.GridListHeader
> {}

const ListSectionHeader = ({ className, ...props }: ListSectionHeaderProps) => {
  return (
    <GridListPrimitive.GridListHeader
      data-slot="list-section-header"
      className={sectionHeader({ className })}
      {...props}
    />
  );
};

export type {
  ListItemDescriptionProps,
  ListItemIconProps,
  ListItemLabelProps,
  ListItemProps,
  ListItemValueProps,
  ListProps,
  ListSectionHeaderProps,
  ListSectionProps,
};
export {
  List,
  ListItem,
  ListItemDescription,
  ListItemIcon,
  ListItemLabel,
  ListItemValue,
  ListSection,
  ListSectionHeader,
};
