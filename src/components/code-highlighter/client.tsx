"use client";

import React from "react";
import {
  TabsRoot as TabsRootBase,
  TabsList as TabsListBase,
  TabsItem,
  TabsPanel as TabsPanelBase,
  type TabsPanelProps,
} from "@/lib/components/core/default/tabs";

export const TabsRoot = TabsRootBase;

export const TabsList = ({
  titles,
  children,
}: {
  titles: string[];
  children: React.ReactNode;
}) => {
  const tabs = React.Children.toArray(children);
  return (
    <TabsListBase>
      {titles.map((title, i) => (
        <TabsItem key={title} id={title}>
          {tabs[i]}
        </TabsItem>
      ))}
    </TabsListBase>
  );
};
export const TabsPanel = (props: TabsPanelProps) => <TabsPanelBase {...props} />;
