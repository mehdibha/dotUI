"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  composeRenderProps,
  Menu as AriaMenu,
  MenuTrigger as AriaMenuTrigger,
  MenuItem as AriaMenuItem,
  SubmenuTrigger as AriaSubmenuTrigger,
  Section as AriaSection,
  SectionProps as AriaSectionProps,
  Header as AriaHeader,
  Collection as AriaCollection,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv } from "tailwind-variants";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Kbd } from "./kbd";
import { Overlay, type OverlayProps } from "./overlay";

const menuStyles = tv({
  slots: {
    overlay: "w-auto min-w-[--trigger-width]",
    backdrop: "",
    content: "outline-none rounded-[inherit] p-1 data-mobile:p-2 data-mobile:space-y-1",
    item: [
      "flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors disabled:pointer-events-none focus:bg-bg-inverse/10 disabled:text-fg-disabled",
      "selection-single:pl-0 selection-multiple:pl-0",
      "[&_svg]:size-4"
    ],
    section: "",
    title: "px-3 py-1.5 text-xs font-bold",
  },
});

interface MenuRootProps extends Omit<AriaMenuTriggerProps, "children"> {
  children: React.ReactNode | (({ isMobile }: { isMobile: boolean }) => React.ReactNode);
  mobileType?: "drawer" | "modal" | "popover";
  mediaQuery?: string;
}
const MenuRoot = ({
  children,
  mobileType = "drawer",
  mediaQuery = "(max-width: 768px)",
  ...props
}: MenuRootProps) => {
  const isMobile = useMediaQuery(mediaQuery);
  return (
    <Provider values={[[MenuContext, { isMobile, mobileType }]]}>
      <AriaMenuTrigger {...props}>
        {typeof children === "function" ? children({ isMobile }) : children}
      </AriaMenuTrigger>
    </Provider>
  );
};

type MenuProps<T> = MenuContentProps<T> & { placement?: OverlayProps["placement"] };
const Menu = <T extends object>({ placement, ...props }: MenuProps<T>) => {
  return (
    <MenuOverlay placement={placement}>
      <MenuContent {...props} />
    </MenuOverlay>
  );
};

const MenuSub = AriaSubmenuTrigger;

const MenuOverlay = ({ placement, ...props }: OverlayProps) => {
  const { isMobile, mobileType } = usePopoverContext();
  const { overlay, backdrop } = menuStyles();
  return (
    <Overlay
      placement={placement}
      isDismissable
      type={isMobile ? mobileType : "popover"}
      classNames={{ overlay: overlay(), backdrop: backdrop() }}
      {...props}
    />
  );
};

type MenuContentProps<T> = AriaMenuProps<T>;
const MenuContent = <T extends object>({ className, ...props }: MenuContentProps<T>) => {
  const { content } = menuStyles();
  const { isMobile, mobileType } = usePopoverContext();
  return (
    <AriaMenu
      className={content({ className })}
      data-mobile={(isMobile && mobileType !== "popover") || undefined}
      {...props}
    />
  );
};

interface MenuItemProps<T> extends Omit<AriaMenuItemProps<T>, "className"> {
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
  ...props
}: MenuItemProps<T>) => {
  const { item } = menuStyles();
  const { isMobile, mobileType } = usePopoverContext();
  return (
    <AriaMenuItem
      className={item({ className })}
      data-mobile={(isMobile && mobileType !== "popover") || undefined}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" ? (
              <span className="flex w-8 items-center justify-center">
                {isSelected && <CheckIcon aria-hidden className="size-4 text-fg" />}
              </span>
            ) : (
              <>{prefix && <span className="mr-2">{prefix}</span>}</>
            )}
            <span className="flex-1 flex flex-col">
              {label && <span className="font-semibold">{label}</span>}
              {description && (
                <span className="text-xs text-fg-muted">{description}</span>
              )}
              {children}
            </span>
            {hasSubmenu ? (
              <span className="ml-3 flex">
                <ChevronRightIcon aria-hidden className="size-4" />
              </span>
            ) : (
              <span className="flex items-center gap-1 ml-3">
                {suffix && <span>{suffix}</span>}
                {shortcut && <Kbd>{shortcut}</Kbd>}
              </span>
            )}
          </>
        )
      )}
    </AriaMenuItem>
  );
};

interface MenuSectionProps<T> extends AriaSectionProps<T> {
  title?: string;
}
const MenuSection = <T extends object>({
  title,
  className,
  ...props
}: MenuSectionProps<T>) => {
  const { section, title: titleStyle } = menuStyles();
  return (
    <AriaSection className={section({ className })}>
      {title && <AriaHeader className={titleStyle()}>{title}</AriaHeader>}
      <AriaCollection items={props.items}>{props.children}</AriaCollection>
    </AriaSection>
  );
};

const MenuContext = React.createContext<{
  isMobile: boolean;
  mobileType: "drawer" | "modal" | "popover";
} | null>(null);

function usePopoverContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a <MenuRoot />");
  }
  return context;
}

export type { MenuRootProps, MenuProps };
export { MenuRoot, Menu, MenuItem, MenuSub, MenuSection };
