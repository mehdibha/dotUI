"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";
import type { TabsProps } from "@dotui/ui/components/tabs";

export function StylePageNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  return (
    <Tabs variant="solid" selectedKey={pathname} {...props}>
      <TabList className="flex-wrap bg-transparent px-0 py-4">
        {[
          { href: `/styles/${username}/${styleName}`, label: "Colors" },
          { href: `/styles/${username}/${styleName}/layout`, label: "Layout" },
          {
            href: `/styles/${username}/${styleName}/typography`,
            label: "Typography",
          },
          {
            href: `/styles/${username}/${styleName}/components`,
            label: "Components",
          },
          {
            href: `/styles/${username}/${styleName}/effects`,
            label: "Effects",
          },
          { href: `/styles/${username}/${styleName}/icons`, label: "Icons" },
        ].map((tab) => (
          <Tab
            key={tab.href}
            id={tab.href}
            href={tab.href}
            className="flex h-7 items-center gap-2 rounded-full px-4 text-sm"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanel id={pathname}>{children}</TabPanel>
    </Tabs>
  );
}
