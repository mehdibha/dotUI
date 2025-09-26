"use client";

import { usePathname } from "next/navigation";
import type { Route } from "next";

import { cn } from "@dotui/ui/lib/utils";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";

export function PageNav({
  items,
  children,
  fade,
}: {
  items: { href: string; label: string }[];
  children: React.ReactNode;
  fade?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Tabs variant="solid" selectedKey={pathname} className="mt-10">
      <TabList className="flex-wrap bg-transparent p-0">
        {items.map((tab) => (
          <Tab
            key={tab.href}
            id={tab.href}
            href={tab.href as Route}
            className={cn(
              "flex h-7 items-center gap-2 rounded-full px-4 text-sm",
              fade && "animate-in fade-in",
            )}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanel id={pathname} className="mt-6">
        {children}
      </TabPanel>
    </Tabs>
  );
}
