"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { TableOfContents as TocType } from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

import { TableOfContents } from "./toc";

// TocContext to provide toc to components
interface TocContextValue {
  toc: TocType | null;
}

const TocContext = createContext<TocContextValue>({
  toc: null,
});

// Hook to get toc: prop > context > null
export function useToc(tocProp?: TocType | null): TocType | null {
  const context = useContext(TocContext);
  if (tocProp !== undefined) return tocProp;
  return context.toc;
}

// Provider component that wraps content and provides toc via context
export function TocProvider({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc: TocType | null;
}) {
  return <TocContext.Provider value={{ toc }}>{children}</TocContext.Provider>;
}

// Context to track if PageTabs is active
interface PageTabsContextValue {
  isActive: boolean;
}

const PageTabsContext = createContext<PageTabsContextValue>({
  isActive: false,
});

export function usePageTabs() {
  return useContext(PageTabsContext);
}

// PageTabs component that wraps DotUI Tabs with sticky tab list styling
export function PageTabs({ children }: { children: React.ReactNode }) {
  return (
    <PageTabsContext.Provider value={{ isActive: true }}>
      <Tabs
        data-page-tabs
        className="mt-4 **:data-page-tab-panel:container **:data-page-tab-panel:max-w-3xl **:data-page-tab-panel:xl:max-w-5xl **:data-page-tab-panel:md:mt-6 **:data-page-tab-panel:sm:mt-4 **:data-page-tab-panel:mt-2"
      >
        <div className="border-b">
          <TabList
            className={cn(
              "*:py-3 *:px-4 *:not-selected:text-fg-muted *:not-selected:hover:text-fg *:duration-100",
              "container max-w-3xl xl:max-w-5xl border-b-0",
            )}
          >
            <Tab id="overview">Overview</Tab>
            <Tab id="examples">Examples</Tab>
          </TabList>
        </div>
        {children}
      </Tabs>
    </PageTabsContext.Provider>
  );
}

// PageTabPanel component
interface PageTabPanelProps {
  id: "overview" | "examples";
  children: React.ReactNode;
  toc?: TocType | null;
}

export function PageTabPanel({
  id,
  children,
  toc: tocProp,
}: PageTabPanelProps) {
  const toc = useToc(tocProp);
  const hasToc = toc && toc.length > 0;

  return (
    <TabPanel id={id} data-page-tab-panel>
      {id === "overview" && (
        <div
          className={cn(
            hasToc &&
              "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(160px,180px)]",
          )}
        >
          <div>{children}</div>
          {hasToc && (
            <TableOfContents
              toc={toc}
              className="sticky max-xl:hidden top-18 **:data-scroll-area-viewport:h-[calc(100svh-calc(var(--spacing)*22))]"
            />
          )}
        </div>
      )}
      {id === "examples" && (
        <div className="grid grid-cols-2 gap-8">{children}</div>
      )}
    </TabPanel>
  );
}
