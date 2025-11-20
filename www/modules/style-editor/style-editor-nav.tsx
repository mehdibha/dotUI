"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  ChevronDownIcon,
  LayoutTemplateIcon,
  PaletteIcon,
  ShapesIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { TabsProps } from "@dotui/registry/ui/tabs";

import { useStyleEditorParams } from "@/modules/style-editor/use-style-editor-params";

export function StyleEditorNav({
  children,
  className,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();
  const { username, style: styleName } = useStyleEditorParams();

  const menuItems = React.useMemo(
    () => getMenuItems(username, styleName),
    [username, styleName],
  );

  const selectedTab = menuItems.find((item) => item.href === pathname);

  return (
    <>
      <div className="mt-4 @lg:hidden">
        <Menu>
          <Button
            variant="quiet"
            className="flex w-full rounded-none border-y text-left sm:px-6 lg:px-10"
          >
            {selectedTab?.icon}
            <span className="flex-1">{selectedTab?.label}</span>
            <ChevronDownIcon />
          </Button>
          <Popover>
            <MenuContent items={menuItems}>
              {(item) => (
                <MenuItem href={item.href} id={item.href}>
                  {item.icon}
                  {item.label}
                </MenuItem>
              )}
            </MenuContent>
          </Popover>
        </Menu>
        <div className="container mt-6 max-w-4xl">{children}</div>
      </div>
      <Tabs
        selectedKey={pathname}
        className={cn("@max-lg:hidden", className)}
        {...props}
      >
        <div className="sticky top-0 z-20 flex h-(--header-height) items-end border-b bg-bg">
          <TabList className="container max-w-4xl overflow-x-auto border-b-0">
            {menuItems.map((tab) => (
              <Tab
                key={tab.href}
                id={tab.href}
                href={tab.href}
                className="flex h-7 items-center gap-2 rounded-full px-4 pt-6 pb-5 text-sm"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </div>
        <TabPanel id={pathname} className="container mt-6 max-w-4xl">
          {children}
        </TabPanel>
      </Tabs>
    </>
  );
}

const getMenuItems = (username: string, styleName: string) =>
  [
    {
      href: `/styles/${username}/${styleName}`,
      label: "Colors",
      icon: <PaletteIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/components`,
      label: "Components",
      icon: <BoxIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/typography`,
      label: "Typography",
      icon: <TypeIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/layout`,
      label: "Layout",
      icon: <LayoutTemplateIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/icons`,
      label: "Icons",
      icon: <ShapesIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/effects`,
      label: "Effects",
      icon: <SparklesIcon />,
    },
  ] as const;
