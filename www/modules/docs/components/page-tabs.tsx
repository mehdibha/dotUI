"use client";

import type React from "react";
import type { TableOfContents as TocType } from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

import { TableOfContents, useToc } from "./toc";

export function PageTabs({ children }: { children: React.ReactNode }) {
  return (
    <Tabs
      data-page-tabs
      className="**:data-page-tab-panel:mt-2 **:data-page-tab-panel:sm:mt-4 **:data-page-tab-panel:md:mt-6"
    >
      <TabList className="*:px-4 *:pb-3">
        <Tab id="overview">Overview</Tab>
        <Tab id="examples">Examples</Tab>
      </TabList>
      {children}
    </Tabs>
  );
}

interface PageTabPanelProps {
  id: "overview" | "examples";
  children: React.ReactNode;
  toc?: TocType | null;
}

export function PageTabPanel({ id, children }: PageTabPanelProps) {
  const toc = useToc();
  const hasToc = toc && toc.length > 0;

  return (
    <TabPanel id={id} data-page-tab-panel>
      {id === "overview" && (
        <div
          className={cn(
            hasToc && "grid grid-cols-1 gap-10 xl:grid-cols-[1fr_180px]",
          )}
        >
          <div>{children}</div>
          {hasToc && (
            <div>
              <TableOfContents
                toc={toc}
                className="sticky top-18 **:data-scroll-area-viewport:h-[calc(100svh-calc(var(--spacing)*22))] max-xl:hidden"
              />
            </div>
          )}
        </div>
      )}
      {id === "examples" && (
        <div className="grid grid-cols-2 gap-8">{children}</div>
      )}
    </TabPanel>
  );
}
