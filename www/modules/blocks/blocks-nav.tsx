"use client";

import type React from "react";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { blocksCategories } from "@dotui/registry/blocks/registry";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { TabsProps } from "@dotui/registry/ui/tabs";

export function BlocksNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();

  return (
    <Tabs selectedKey={pathname} {...props}>
      <div className="sticky top-0 z-10 flex h-(--header-height) items-end border-b bg-bg pt-1">
        <TabList className="container translate-y-px border-b-0">
          {[
            {
              href: "/blocks",
              label: "Featured",
            },
            ...blocksCategories
              .filter((category) => category.slug !== "featured")
              .map((category) => ({
                href: `/blocks/${category.slug}`,
                label: category.name,
              })),
          ].map((tab) => (
            <Tab
              key={tab.href}
              id={tab.href}
              href={tab.href as Route}
              className="flex items-center gap-2 rounded-full px-4 py-3 text-sm"
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
