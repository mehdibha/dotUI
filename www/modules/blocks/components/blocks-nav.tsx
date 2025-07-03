"use client";

import { usePathname } from "next/navigation";

import { blocksCategories } from "@dotui/registry-definition/registry-blocks";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";
import type { TabsProps } from "@dotui/ui/components/tabs";

export function BlocksNav({
  children,
  ...props
}: { children: React.ReactNode } & TabsProps) {
  const pathname = usePathname();

  return (
    <Tabs variant="solid" selectedKey={pathname} {...props}>
      <TabList className="sticky top-18 mt-10 z-20 flex-wrap bg-bg pt-0 pb-4">
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
      <TabPanel id={pathname} className="">
        {children}
      </TabPanel>
    </Tabs>
  );
}
