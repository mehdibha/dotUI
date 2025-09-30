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
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs/motion";
import type { TabsProps } from "@dotui/registry/ui/tabs";

import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";

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
      <div className="@lg:hidden mt-4">
        <MenuRoot>
          <Button
            variant="quiet"
            prefix={selectedTab?.icon}
            suffix={<ChevronDownIcon />}
            className="flex w-full rounded-none border-y text-left sm:px-6 lg:px-10"
          >
            <span className="flex-1">{selectedTab?.label}</span>
          </Button>
          <Menu items={menuItems}>
            {({ href, label, icon }) => (
              <MenuItem href={href} id={href} prefix={icon}>
                {label}
              </MenuItem>
            )}
          </Menu>
        </MenuRoot>
        <div className="container mt-6 max-w-4xl">{children}</div>
      </div>
      <Tabs
        variant="underline"
        selectedKey={pathname}
        className={cn("@max-lg:hidden", className)}
        {...props}
      >
        <div className="bg-bg sticky top-0 z-10 border-b">
          <TabList className="container max-w-4xl overflow-x-auto border-b-0">
            {menuItems.map((tab) => (
              <Tab
                key={tab.href}
                id={tab.href}
                href={tab.href}
                className="flex h-7 items-center gap-2 rounded-full px-4 pb-5 pt-6 text-sm"
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
      href: `/styles/${username}/${styleName}/layout`,
      label: "Layout",
      icon: <LayoutTemplateIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/typography`,
      label: "Typography",
      icon: <TypeIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/components`,
      label: "Components",
      icon: <BoxIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/effects`,
      label: "Effects",
      icon: <SparklesIcon />,
    },
    {
      href: `/styles/${username}/${styleName}/icons`,
      label: "Icons",
      icon: <ShapesIcon />,
    },
  ] as const;
