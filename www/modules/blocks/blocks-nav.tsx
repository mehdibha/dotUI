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

import { blocksCategories } from "../../../packages/registry-definition/dist/registry-blocks";

export function BlocksNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();

  return (
    <Tabs variant="underline" selectedKey={pathname} {...props}>
      <div className="bg-bg sticky top-0 z-40 border-b">
        <TabList className="container border-b-0">
          {[
            ...blocksCategories.map((category) => ({
              href: `/blocks/${category.slug}`,
              label: category.name,
            })),
          ].map((tab) => (
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
      <TabPanel id={pathname} className="container mt-6">
        {children}
      </TabPanel>
    </Tabs>
  );
}
