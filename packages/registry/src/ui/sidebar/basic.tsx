"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useSlotId } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import { PanelLeftIcon } from "lucide-react";
import {
  ButtonContext as AriaButtonContext,
  Header as AriaHeader,
  Heading as AriaHeading,
  HeadingContext as AriaHeadingContext,
  DEFAULT_SLOT,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { useKeyboardShortcut } from "@dotui/registry/hooks/use-keyboard-shortcut";
import { createContext } from "@dotui/registry/lib/context";
import { cn } from "@dotui/registry/lib/utils";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

const SIDEBAR_WIDTH = "15rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const [SidebarContext, useSidebarContext] = createContext<SidebarContextProps>({
  name: "SidebarProvider",
  strict: true,
});

function SidebarProvider({
  defaultOpen = true,
  isOpen: isOpenProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setOpen] = useControlledState<boolean>(
    isOpenProp,
    defaultOpen,
    setOpenProp,
  );

  const toggleSidebar = React.useCallback(() => {
    setOpen(!isOpen);
  }, [setOpen, isOpen]);

  useKeyboardShortcut({
    key: SIDEBAR_KEYBOARD_SHORTCUT,
    metaKey: true,
    onPress: toggleSidebar,
  });

  return (
    <SidebarContext
      value={{
        isOpen,
        setOpen,
        toggleSidebar,
      }}
    >
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  );
}

const sidebarStyles = tv({
  slots: {
    root: "group peer hidden md:block",
    gap: [
      "relative bg-transparent transition-[width] duration-250 ease-drawer",
      "w-(--sidebar-width-icon) group-data-expanded:w-(--sidebar-width)",
      "group-placement-right:rotate-180",
    ],
    container: [
      "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-250 ease-drawer md:flex",
      "w-(--sidebar-width-icon) group-data-expanded:w-(--sidebar-width)",
      "group-placement-left:left-0 group-placement-left:border-r",
      "group-placement-right:right-0 group-placement-right:border-l",
    ],
    inner:
      "flex h-full w-full flex-col bg-sidebar transition-colors duration-250 ease-drawer",
    header: "flex flex-col gap-2 p-2",
    footer: "flex flex-col gap-2 p-2",
    separator: "mx-2 w-auto",
    content:
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
    section: "relative flex w-full min-w-0 flex-col p-2",
    heading: [
      "flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2 font-medium text-fg-muted text-xs outline-hidden [&>svg]:size-4 [&>svg]:shrink-0",
    ],
    list: "flex w-full min-w-0 flex-col gap-1",
    item: "whitespace-nowrap *:data-[slot=button]:w-full *:data-[slot=button]:justify-start *:data-[slot=button]:overflow-hidden *:data-[slot=button]:p-1.75 *:data-[slot=button]:text-left *:data-[slot=button]:[&>svg]:shrink-0",
  },
});

const {
  root,
  gap,
  container,
  inner,
  header,
  footer,
  content,
  section,
  heading,
  list,
  item,
} = sidebarStyles();

function Sidebar({
  className,
  placement = "left",
  children,
  ...props
}: React.ComponentProps<"div"> & { placement?: "left" | "right" }) {
  const { isOpen, toggleSidebar } = useSidebarContext("Sidebar");
  const headingId = useSlotId();

  return (
    <div
      className={root()}
      data-expanded={isOpen || undefined}
      data-placement={placement}
      data-slot="sidebar"
    >
      <div className={gap()} />
      <div data-slot="sidebar-container" className={container()} {...props}>
        <nav
          data-slot="sidebar-inner"
          className={inner({ className })}
          aria-labelledby={headingId}
        >
          <Provider
            values={[
              [AriaHeadingContext, { id: headingId }],
              [
                AriaButtonContext,
                {
                  slots: {
                    [DEFAULT_SLOT]: {},
                    "sidebar-trigger": {
                      "aria-label": "Toggle Sidebar",
                      onPress: toggleSidebar,
                      children: <PanelLeftIcon />,
                    },
                  },
                },
              ],
            ]}
          >
            {children}
          </Provider>
        </nav>
      </div>
    </div>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <AriaHeader
      data-slot="sidebar-header"
      className={header({ className })}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Provider values={[[AriaHeadingContext, null]]}>
      <div
        data-slot="sidebar-content"
        data-sidebar="content"
        className={content({ className })}
        {...props}
      />
    </Provider>
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Provider values={[[AriaHeadingContext, null]]}>
      <div
        data-slot="sidebar-footer"
        className={footer({ className })}
        {...props}
      />
    </Provider>
  );
}

function SidebarSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  const headingId = useSlotId();
  return (
    <Provider values={[[AriaHeadingContext, { id: headingId }]]}>
      <section
        data-slot="sidebar-section"
        aria-labelledby={headingId}
        className={section({ className })}
        {...props}
      />
    </Provider>
  );
}

function SidebarSectionHeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <AriaHeading
      data-slot="sidebar-group-label"
      className={heading({ className })}
      {...props}
    />
  );
}

function SidebarList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="sidebar-list" className={list({ className })} {...props} />
  );
}

function SidebarItem({
  tooltip,
  className,
  ...props
}: React.ComponentProps<"li"> & {
  tooltip?: React.ReactNode;
}) {
  const { isOpen } = useSidebarContext("SidebarItem");

  const comp = (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={item({ className })}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <Tooltip isDisabled={isOpen} delay={0}>
        {comp}
        <TooltipContent hideArrow>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return comp;
}

function SidebarTooltip({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarContext("SidebarTooltip");

  return (
    <Tooltip isDisabled={isOpen} delay={0}>
      {children}
      <TooltipContent hideArrow placement="right">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSection,
  SidebarSectionHeading,
  SidebarTooltip,
  SidebarItem,
  SidebarList,
  SidebarFooter,
  sidebarStyles,
};

export { useSidebarContext };
