"use client";

import type React from "react";
import { AlignLeftIcon } from "lucide-react";
import type { TableOfContents as TocType } from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

import { TOCItems, TOCScrollArea, useTOCItems } from "./toc";

export function PageTabs({ children }: { children: React.ReactNode }) {
  return (
    <Tabs
      data-page-tabs
      defaultSelectedKey="overview"
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
  const tocItems = useTOCItems();
  const hasToc = tocItems && tocItems.length > 0;

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
            <div className="sticky top-10 flex h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden">
              <h3
                id="toc-title"
                className="inline-flex items-center gap-1.5 text-fd-muted-foreground text-sm"
              >
                <AlignLeftIcon className="size-4 text-fg-muted" />
                On this page
              </h3>
              <TOCScrollArea>
                <TOCItems />
              </TOCScrollArea>
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
