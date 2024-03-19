"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export function TabsRoot({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: string;
}) {
  return <TabsPrimitive.Root defaultValue={defaultValue}>{children}</TabsPrimitive.Root>;
}

export function TabsList({
  titles,
  children,
}: {
  titles: string[];
  children: React.ReactNode;
}) {
  const tabs = React.Children.toArray(children);
  return (
    <TabsPrimitive.List style={{ display: "flex" }}>
      {titles.map((title, i) => (
        <TabsPrimitive.Trigger asChild key={title} value={title}>
          {tabs[i]}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
  );
}
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, ref) => <TabsPrimitive.Content ref={ref} className="border-3" {...props} />);

TabsContent.displayName = TabsPrimitive.Content.displayName;
