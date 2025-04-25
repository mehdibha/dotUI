"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  composeRenderProps,
  Menu as AriaMenu,
  MenuTrigger as AriaMenuTrigger,
  MenuItem as AriaMenuItem,
  SubmenuTrigger as AriaSubmenuTrigger,
  MenuSection as AriaMenuSection,
  Header as AriaHeader,
  Collection as AriaCollection,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type MenuSectionProps as AriaMenuSectionProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Kbd } from "@/registry/minimalist/ui/kbd_basic";
import {
  Overlay,
  type OverlayProps,
} from "@/registry/minimalist/ui/overlay_basic";
import { Text } from "@/registry/minimalist/ui/text_basic";

const menuStyles = tv({
  base: [
    "max-h[inherit] outline-hidden rounded-[inherit] p-1",
    "group-data-[type=drawer]/overlay:p-2",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
});

const menuItemStyles = tv({
  base: [
    "focus:bg-bg-inverse/10 disabled:text-fg-disabled outline-hidden flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none",
    "selection-single:pl-0 selection-multiple:pl-0",
    "group-data-[type=drawer]/overlay:text-md group-data-[type=drawer]/overlay:py-3",
    "group-data-[type=modal]/overlay:text-md group-data-[type=modal]/overlay:py-2",
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
};
const Menu = <T extends object>({
  type = "popover",
  mobileType = "drawer",
  ...props
}: MenuProps<T>) => {
  return (
    <Overlay type={type} mobileType={mobileType}>
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
        menuStyles({ className })
      )}
      {...props}
    />
  );
};

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
    <AriaMenuItem className={menuItemStyles({ className, variant })} {...props}>
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
            <span className="flex items-center gap-2">
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
        )
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

export type { MenuProps, MenuRootProps };
export { Menu, MenuRoot, MenuItem, MenuContent, MenuSub, MenuSection };
