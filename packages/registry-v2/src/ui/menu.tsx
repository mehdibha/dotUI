"use client";

import type * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  MenuTriggerProps as AriaMenuTriggerProps,
  SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";


import { cn } from "../lib/utils";

const menuStyles = tv({
  base: [
    "max-h[inherit] rounded-[inherit] p-1 outline-hidden",
    "group-data-[type=drawer]/overlay:p-2",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
});

/* -----------------------------------------------------------------------------------------------*/

interface MenuProps extends AriaMenuTriggerProps {}

const Menu = (props: MenuProps) => {
  return <AriaMenuTrigger {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuContentProps<T> extends AriaMenuProps<T> {}
const MenuContent = <T extends object>({
  className,
  ...props
}: MenuContentProps<T>) => {
  return (
    <AriaMenu
      className={composeRenderProps(className, (className) =>
        menuStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuSubProps extends AriaSubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
  return <AriaSubmenuTrigger {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const menuItemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:text-fg-disabled",
    "selection-single:pl-0 selection-multiple:pl-0",
    "group-data-[slot=drawer]/overlay:py-3 group-data-[slot=drawer]/overlay:text-base",
    "group-data-[slot=modal]/overlay:py-2 group-data-[slot=modal]/overlay:text-base",
    "[&_svg]:size-4",
    "[&_kbd]:bg-transparent [&_kbd]:text-fg-muted",
  ],
  variants: {
    variant: {
      default: "text-fg",
      success: "text-fg-success",
      warning: "text-fg-warning",
      accent: "text-fg-accent",
      danger: "text-fg-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MenuItemProps<T>
  extends AriaMenuItemProps<T>,
    VariantProps<typeof menuItemStyles> {}

const MenuItem = <T extends object>({
  className,
  variant,
  ...props
}: MenuItemProps<T>) => {
  return (
    <AriaMenuItem
      data-slot="menu-item"
      className={composeRenderProps(className, (className) =>
        menuItemStyles({ className, variant }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-8 items-center justify-center">
                {isSelected && (
                  <CheckIcon aria-hidden className="size-4 text-fg-accent" />
                )}
              </span>
            )}
            {children}
            {hasSubmenu && <ChevronRightIcon aria-hidden className="size-4" />}
          </>
        ),
      )}
    </AriaMenuItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const menuSectionStyles = tv({
  base: "space-y-px pt-2",
});

interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {}
const MenuSection = <T extends object>({
  children,
  className,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <AriaMenuSection className={menuSectionStyles({ className })} {...props}>
      {children}
    </AriaMenuSection>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuHeaderProps extends React.ComponentProps<typeof AriaHeader> {}

const MenuHeader = ({ className, ...props }: MenuHeaderProps) => {
  return (
    <AriaHeader
      className={cn("text-sm font-medium text-fg-muted", className)}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Menu, MenuItem, MenuContent, MenuSub, MenuSection, MenuHeader };

export type { MenuContentProps, MenuItemProps, MenuSectionProps, MenuSubProps };
