"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as MenuPrimitives from "react-aria-components/Menu";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";

const menuVariants = tv({
  slots: {
    root: "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden **:data-separator:my-1 **:data-separator:w-auto text-sm p-1 **:data-separator:-mx-1",
    item: "relative flex w-full cursor-interactive items-center gap-2 outline-hidden select-ui disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0 focus:bg-highlight focus:text-fg-on-highlight disabled:text-(--disabled-fg,currentColor) disabled:**:text-current has-data-menu-item-description:flex-col has-data-menu-item-description:items-start has-data-menu-item-description:gap-0 has-data-menu-item-description:has-[>svg]:pl-8 has-data-menu-item-description:*:[svg]:absolute has-data-menu-item-description:*:[svg]:top-2 has-data-menu-item-description:*:[svg]:left-2 data-has-submenu:pr-8 *:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted data-[variant=danger]:text-fg-danger data-[variant=danger]:focus:bg-danger-muted gap-1.5 py-1 text-sm **:[svg]:not-with-[size]:size-4 data-selection-mode:pr-8 rounded-md px-1.5",
    indicator:
      "pointer-events-none absolute flex items-center justify-center right-2",
    submenuIndicator:
      "pointer-events-none absolute right-2 flex items-center justify-center",
    itemLabel: "",
    itemDescription: "text-fg-muted",
    section: "scroll-my-1",
    sectionTitle: "font-medium text-fg-muted py-1 px-1.5 text-xs",
  },
});

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
  const { root } = menuVariants();
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
  const { item, indicator, submenuIndicator } = menuVariants();
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
                {isSelected && (
                  <CheckIcon aria-hidden className="size-4 text-fg-accent" />
                )}
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
  const { itemLabel } = menuVariants();
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
  const { itemDescription } = menuVariants();
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
  const { section } = menuVariants();
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
  const { sectionTitle } = menuVariants();
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
