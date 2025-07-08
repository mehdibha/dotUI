"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";
import type { TabsProps } from "@dotui/ui/components/tabs";

export function StyleNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const { style } = useParams<{ style: string }>();
  const pathname = usePathname();

  return (
    <Tabs variant="solid" selectedKey={pathname} {...props}>
      <TabList className="flex-wrap bg-transparent px-0 py-4">
        {[
          { href: `/style/${style}`, label: "Colors" },
          { href: `/style/${style}/layout`, label: "Layout" },
          { href: `/style/${style}/typography`, label: "Typography" },
          { href: `/style/${style}/components`, label: "Components" },
          { href: `/style/${style}/effects`, label: "Effects" },
          { href: `/style/${style}/icons`, label: "Icons" },
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
