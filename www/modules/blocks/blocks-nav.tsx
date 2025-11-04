"use client";

import type React from "react";
import { useEffect } from "react";
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

  // Make header non-sticky on blocks pages
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.position = "relative";
    }
    return () => {
      if (header) {
        header.style.position = "sticky";
      }
    };
  }, []);

  return (
    <Tabs selectedKey={pathname} {...props}>
      <div className="sticky top-0 z-10 h-12 bg-bg pt-1 border-b flex items-end">
        <TabList className="container border-b-0 translate-y-px">
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
              className="flex items-center gap-2 rounded-full py-3 px-4 text-sm"
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
