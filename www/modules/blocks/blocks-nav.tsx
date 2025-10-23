"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { blocksCategories } from "@dotui/registry/blocks/registry";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs/motion";
import type { TabsProps } from "@dotui/registry/ui/tabs";

export function BlocksNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();

  return (
    <Tabs variant="underline" selectedKey={pathname} {...props}>
      <div className="sticky top-0 z-40 border-b bg-bg">
        <TabList className="container border-b-0">
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
              className="flex h-7 items-center gap-2 rounded-full px-4 pt-6 pb-5 text-sm"
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
