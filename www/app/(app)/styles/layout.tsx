"use client";

import { usePathname } from "next/navigation";

import { Button } from "@dotui/ui/components/button";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";

export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container max-w-screen-2xl p-14">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">
        Find your style or make your own.
      </h2>
      <p className="mt-2 text-base text-fg-muted">
        Choose a style to get started or create your own.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <Button variant="primary">Create style</Button>
        <Button>Browse styles</Button>
      </div>
      <div className="mt-16">
        <Tabs variant="solid" selectedKey={pathname}>
          <TabList className="flex-wrap bg-transparent p-0">
            {[
              { href: "/styles", label: "Featured" },
              { href: "/styles/community", label: "Community" },
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
          <TabPanel id={pathname} className="mt-6">
            {children}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
