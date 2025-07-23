"use client";

import { usePathname } from "next/navigation";

import { Button } from "@dotui/ui/components/button";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@dotui/ui/registry/components/tabs/motion";

import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";

export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container p-14">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="w-fit text-3xl font-semibold tracking-tight">
            Find your style or make your own.
          </h2>
          <p className="text-fg-muted mt-2 text-base">
            Choose a style to get started or create your own.
          </p>
        </div>
          <CreateStyleModal>
            <Button variant="primary">Create style</Button>
          </CreateStyleModal>
        {/* <div className="flex items-center gap-2">
          <Button>Browse styles</Button>
        </div> */}
      </div>
      <div className="mt-10">
        <Tabs variant="solid" selectedKey={pathname}>
          <TabList className="flex-wrap bg-transparent p-0">
            {[
              { href: "/styles/your-styles", label: "Your styles" },
              { href: "/styles", label: "Featured" },
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
