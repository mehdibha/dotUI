"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as MenuPrimitives from "react-aria-components/Menu";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { tv } from "tailwind-variants";

const menuVariants = tv({
  slots: {
    root: "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row layout-grid:grid layout-grid:gap-1 layout-grid:orientation-vertical:grid-cols-2 layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2 **:data-separator:my-1 **:data-separator:w-auto in-data-trigger:min-w-[calc(max(var(--trigger-width,0px),--spacing(32))-2*1px)] in-data-trigger:max-w-[calc(100vw-2rem)] text-base p-1 **:data-separator:-mx-1",
    item: "group/list-item relative flex w-full cursor-interactive items-center outline-hidden select-ui in-data-trigger:whitespace-nowrap disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0 disabled:text-(--disabled-fg,currentColor) disabled:**:text-current data-[variant=danger]:text-fg-danger has-[[slot=description]]:flex-col has-[[slot=description]]:items-start has-[[slot=description]]:gap-0 has-[[slot=description]]:has-[>svg]:pl-8 has-[[slot=description]]:*:[svg]:absolute has-[[slot=description]]:*:[svg]:top-2 has-[[slot=description]]:*:[svg]:left-2 has-submenu:pr-8 *:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted gap-3 py-2 text-base **:[svg]:not-with-[size]:size-5 data-selection-mode:pr-8 focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-highlight focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight focus-visible:bg-highlight focus-visible:text-fg-on-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-highlight data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-danger-muted data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-danger data-[variant=danger]:focus-visible:bg-danger-muted data-[variant=danger]:focus-visible:text-fg-danger data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-danger-muted data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-danger rounded-md px-3",
    indicator:
      "pointer-events-none group-has-[[slot=description]]/list-item:absolute group-has-[[slot=description]]/list-item:top-2 absolute right-2 flex items-center justify-center",
    submenuIndicator:
      "pointer-events-none absolute right-2 flex items-center justify-center",
    itemLabel:
      "in-data-trigger:max-w-full in-data-trigger:min-w-0 in-data-trigger:overflow-x-clip in-data-trigger:text-ellipsis",
    itemDescription: "whitespace-normal text-fg-muted",
    section: "scroll-my-1",
    sectionTitle: "font-medium text-fg-muted py-2 px-3 text-xs",
  },
});

const {
  root,
  item,
  indicator,
  submenuIndicator,
  itemLabel,
  itemDescription,
  section,
  sectionTitle,
} = menuVariants();

/* -------------------------------------------------------------------------- */

interface MenuProps extends MenuPrimitives.MenuTriggerProps {}

const Menu = (props: MenuProps) => {
  return <MenuPrimitives.MenuTrigger {...props} />;
};

/* -------------------------------------------------------------------------- */

interface MenuContentProps<T> extends MenuPrimitives.MenuProps<T> {}
const MenuContent = <T extends object>({
  className,
  ...props
}: MenuContentProps<T>) => {
  return (
    <MenuPrimitives.Menu
      data-menu-content=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface MenuSubProps extends MenuPrimitives.SubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
  return <MenuPrimitives.SubmenuTrigger {...props} />;
};

/* -------------------------------------------------------------------------- */

interface MenuItemProps<T> extends MenuPrimitives.MenuItemProps<T> {
  variant?: "default" | "danger";
}

const MenuItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: MenuItemProps<T>) => {
  const textValue =
    textValueProp ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <MenuPrimitives.MenuItem
      data-slot="menu-item"
      data-menu-item=""
      data-variant={variant}
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span data-menu-item-indicator="" className={indicator()}>
                {isSelected && <CheckIcon aria-hidden />}
              </span>
            )}
            {typeof children === "string" ? (
              <MenuItemLabel>{children}</MenuItemLabel>
            ) : (
              children
            )}
            {hasSubmenu && (
              <span data-menu-item-indicator="" className={submenuIndicator()}>
                <ChevronRightIcon aria-hidden className="size-4" />
              </span>
            )}
          </>
        ),
      )}
    </MenuPrimitives.MenuItem>
  );
};

/* -------------------------------------------------------------------------- */

interface MenuItemLabelProps extends React.ComponentProps<
  typeof MenuPrimitives.Text
> {}
const MenuItemLabel = ({ className, ...props }: MenuItemLabelProps) => {
  return (
    <MenuPrimitives.Text
      data-menu-item-label=""
      slot="label"
      className={itemLabel({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface MenuItemDescriptionProps extends React.ComponentProps<
  typeof MenuPrimitives.Text
> {}
const MenuItemDescription = ({
  className,
  ...props
}: MenuItemDescriptionProps) => {
  return (
    <MenuPrimitives.Text
      data-menu-item-description=""
      slot="description"
      className={itemDescription({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface MenuSectionProps<T> extends MenuPrimitives.MenuSectionProps<T> {}
const MenuSection = <T extends object>({
  children,
  className,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <MenuPrimitives.MenuSection
      data-menu-section=""
      className={section({ className })}
      {...props}
    >
      {children}
    </MenuPrimitives.MenuSection>
  );
};

/* -------------------------------------------------------------------------- */

interface MenuSectionHeaderProps extends React.ComponentProps<
  typeof MenuPrimitives.Header
> {}

const MenuSectionHeader = ({ className, ...props }: MenuSectionHeaderProps) => {
  return (
    <MenuPrimitives.Header
      data-menu-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  MenuContentProps,
  MenuItemDescriptionProps,
  MenuItemLabelProps,
  MenuItemProps,
  MenuProps,
  MenuSectionHeaderProps,
  MenuSectionProps,
  MenuSubProps,
};
export {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
};
