"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  composeRenderProps,
  Menu as AriaMenu,
  MenuTrigger as AriaMenuTrigger,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  SubmenuTrigger,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv } from "tailwind-variants";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Overlay, type OverlayProps } from "./overlay";

const menuStyles = tv({
  slots: {
    overlay: "",
    backdrop: "",
    content: "outline-none rounded-[inherit] p-1 data-mobile:p-2 data-mobile:space-y-1",
    item: [
      "relative flex cursor-pointer items-center rounded-sm px-3 pr-8 py-1.5 text-sm outline-none transition-colors disabled:pointer-events-none focus:bg-bg-inverse/10 pressed:bg-bg-inserse/15 disabled:bg-bg-disabled disabled:text-fg-disabled",
      "data-mobile:px-4 data-mobile:py-3 data-mobile:text-base",
      "selection-mode-single:pl-8 selection-mode-multiple:pl-8 data-[selection-mode=multiple]:pl-8",
    ],
  },
});

interface MenuRootProps extends Omit<AriaDialogTriggerProps, "children"> {
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

type MenuProps<T> = MenuContentProps<T>;
const Menu = <T extends object>({ ...props }: MenuProps<T>) => {
  return (
    <MenuOverlay>
      <MenuContent {...props} />
    </MenuOverlay>
  );
};

const MenuSub = SubmenuTrigger;

const MenuOverlay = ({ placement = "bottom right", ...props }: OverlayProps) => {
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
  className?: string;
}
const MenuItem = <T extends object>({ className, ...props }: MenuItemProps<T>) => {
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
            {selectionMode !== "none" && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                {isSelected && <CheckIcon aria-hidden className="size-4" />}
              </span>
            )}
            <span>{children}</span>
            {hasSubmenu && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <ChevronRightIcon aria-hidden className="size-4" />
              </span>
            )}
          </>
        )
      )}
    </AriaMenuItem>
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
export { MenuRoot, Menu, MenuItem, MenuSub };
