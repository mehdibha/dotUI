"use client";

import { usePathname } from "next/navigation";

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container max-w-screen-2xl p-14">
      <h2 className="text-4xl font-semibold tracking-tighter text-balance">
        Blocks that don’t lock you in.
      </h2>
      <p className="mt-2 text-base text-fg-muted">
        Modern UI blocks available in infinite styles.
      </p>
      <div className="mt-16">
        <Tabs variant="solid" selectedKey={pathname}>
          <TabList className="flex-wrap bg-transparent p-0">
            {[
              { href: "/blocks", label: "Featured" },
              { href: "/blocks/authentication", label: "Authentication" },
              { href: "/blocks/marketing", label: "Marketing" },
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
