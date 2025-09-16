"use client";

import * as React from "react";
import {
  Collection as AriaCollection,
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

import { Kbd } from "@dotui/ui/components/kbd";
import { Overlay } from "@dotui/ui/components/overlay";
import { Text } from "@dotui/ui/components/text";
import { CheckIcon, ChevronRightIcon } from "@dotui/ui/icons";
import type { OverlayProps } from "@dotui/ui/components/overlay";

const menuStyles = tv({
  base: [
    "max-h[inherit] outline-hidden rounded-[inherit] p-1",
    "group-data-[type=drawer]/overlay:p-2",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
});

const menuItemStyles = tv({
  base: [
    "outline-hidden focus:bg-inverse/10 disabled:text-fg-disabled flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none",
    "selection-single:pl-0 selection-multiple:pl-0",
    "group-data-[slot=drawer]/overlay:py-3 group-data-[slot=drawer]/overlay:text-base",
    "group-data-[slot=modal]/overlay:py-2 group-data-[slot=modal]/overlay:text-base",
    "[&_svg]:size-4",
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

const menuSectionStyles = tv({
  base: "space-y-px pt-2",
});

type MenuRootProps = AriaMenuTriggerProps;
const MenuRoot = (props: MenuRootProps) => {
  return <AriaMenuTrigger {...props} />;
};

type MenuProps<T> = MenuContentProps<T> & {
  type?: OverlayProps["type"];
  mobileType?: OverlayProps["mobileType"];
  overlayProps?: OverlayProps;
};
const Menu = <T extends object>({
  type = "popover",
  mobileType = "drawer",
  overlayProps,
  ...props
}: MenuProps<T>) => {
  return (
    <Overlay type={type} mobileType={mobileType} {...overlayProps}>
      <MenuContent {...props} />
    </Overlay>
  );
};

type MenuContentProps<T> = AriaMenuProps<T>;
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

type MenuSubProps = AriaSubmenuTriggerProps;
const MenuSub = AriaSubmenuTrigger;

interface MenuItemProps<T>
  extends Omit<AriaMenuItemProps<T>, "className">,
    VariantProps<typeof menuItemStyles> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  label?: string;
  description?: string;
  shortcut?: string;
  className?: string;
}
const MenuItem = <T extends object>({
  className,
  label,
  description,
  prefix,
  suffix,
  shortcut,
  variant,
  ...props
}: MenuItemProps<T>) => {
  return (
    <AriaMenuItem
      className={menuItemStyles({ className, variant })}
      data-slot="menu-item"
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-8 items-center justify-center">
                {isSelected && (
                  <CheckIcon aria-hidden className="text-fg-accent size-4" />
                )}
              </span>
            )}
            {prefix}
            <span className="flex flex-1 items-center gap-2">
              <span className="flex flex-1 flex-col">
                {label && <Text slot="label">{label}</Text>}
                {description && <Text slot="description">{description}</Text>}
                {children}
              </span>
              {suffix}
              {shortcut && <Kbd>{shortcut}</Kbd>}
              {hasSubmenu && (
                <ChevronRightIcon aria-hidden className="size-4" />
              )}
            </span>
          </>
        ),
      )}
    </AriaMenuItem>
  );
};

interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  ref?: React.Ref<HTMLElement>;
  title?: React.ReactNode;
}
const MenuSection = <T extends object>({
  title,
  children,
  className,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <AriaMenuSection className={menuSectionStyles({ className })} {...props}>
      {title && (
        <AriaHeader className="text-fg-muted mb-1 pl-3 text-xs">
          {title}
        </AriaHeader>
      )}
      <AriaCollection items={props.items}>{children}</AriaCollection>
    </AriaMenuSection>
  );
};

export type {
  MenuRootProps,
  MenuProps,
  MenuContentProps,
  MenuItemProps,
  MenuSectionProps,
  MenuSubProps,
};
export { MenuRoot, Menu, MenuItem, MenuContent, MenuSub, MenuSection };
