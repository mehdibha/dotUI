"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useIntersection } from "react-use";

import { blocksCategories } from "@dotui/registry-definition/registry-blocks";
import { cn } from "@dotui/ui/lib/utils";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";
import type { TabsProps } from "@dotui/ui/components/tabs";

import { StyleSelector } from "@/modules/styles/components/style-selector";

export function BlocksNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    sentinelRef as React.RefObject<HTMLElement>,
    {
      threshold: 0,
      root: null,
      rootMargin: "0px",
    },
  );

  const isSticky = intersection?.isIntersecting === false;

  return (
    <Tabs variant="solid" selectedKey={pathname} {...props}>
      <div ref={sentinelRef} />
      <div
        className={cn(
          "sticky top-0 z-20 container max-w-screen-2xl bg-bg px-14",
          isSticky && "border-b border-border",
        )}
      >
        <TabList className="bg-transparent px-0 py-4">
          {[
            { href: "/blocks", label: "Featured" },
            ...blocksCategories.map((category) => ({
              href: `/blocks/${category.slug}`,
              label: category.name,
            })),
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
      </div>
      <TabPanel id={pathname} className="container max-w-screen-2xl px-14">
        {children}
      </TabPanel>
    </Tabs>
  );
}
