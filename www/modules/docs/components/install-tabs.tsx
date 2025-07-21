"use client";

import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@dotui/ui/components/skeleton";
import * as TabsPrimitive from "@dotui/ui/components/tabs";
import { cn } from "@dotui/ui/lib/utils";
import type {
  TabsProps as BaseProps,
  TabPanelProps,
} from "@dotui/ui/components/tabs";

import { useTRPC } from "@/lib/trpc/react";

const StyleNameWithSkeleton = () => {
  const trpc = useTRPC();

  const { data: currentStyle, isLoading } = useQuery({
    ...trpc.style.getCurrentStyle.queryOptions(),
  });

  if (isLoading) {
    return (
      <Skeleton show className="inline-block h-4 w-20">
        placeholder
      </Skeleton>
    );
  }

  return currentStyle || "{{STYLE_NAME}}";
};

type ChangeListener = (v: string) => void;
const listeners = new Map<string, ChangeListener[]>();

function addChangeListener(id: string, listener: ChangeListener): void {
  const list = listeners.get(id) ?? [];
  list.push(listener);
  listeners.set(id, list);
}

function removeChangeListener(id: string, listener: ChangeListener): void {
  const list = listeners.get(id) ?? [];
  listeners.set(
    id,
    list.filter((item) => item !== listener),
  );
}

function update(id: string, v: string, persist: boolean): void {
  listeners.get(id)?.forEach((item) => {
    item(v);
  });

  if (persist) localStorage.setItem(id, v);
  else sessionStorage.setItem(id, v);
}

export interface TabsProps extends Omit<BaseProps, "children"> {
  children: React.ReactNode;
  groupId?: string;
  persist?: boolean;
  defaultIndex?: number;
  items?: string[];
}

export function InstallTabs({
  children,
  groupId,
  items = [],
  persist = false,
  defaultIndex = 0,
  ...props
}: TabsProps): React.ReactElement {
  const values = useMemo(() => items.map((item) => toValue(item)), [items]);
  const [value, setValue] = useState(values[defaultIndex]);

  useLayoutEffect(() => {
    if (!groupId) return;

    const onUpdate: ChangeListener = (v) => {
      if (values.includes(v)) setValue(v);
    };

    const previous = persist
      ? localStorage.getItem(groupId)
      : sessionStorage.getItem(groupId);

    if (previous) onUpdate(previous);
    addChangeListener(groupId, onUpdate);
    return () => {
      removeChangeListener(groupId, onUpdate);
    };
  }, [groupId, persist, values]);

  const onValueChange = useCallback(
    (v: string) => {
      if (groupId) {
        update(groupId, v, persist);
      } else {
        setValue(v);
      }
    },
    [groupId, persist],
  );

  const processedChildren = useMemo(() => {
    if (!children) return null;

    const replaceInContent = (content: any): any => {
      if (typeof content === "string") {
        // Replace {{STYLE_NAME}} with our component that handles loading states
        if (content.includes("{{STYLE_NAME}}")) {
          const parts = content.split(/(\{\{STYLE_NAME\}\})/g);
          const elements = parts
            .filter((part) => part !== "")
            .map((part, index) => {
              if (part === "{{STYLE_NAME}}") {
                return <StyleNameWithSkeleton key={`style-${index}`} />;
              }
              return <span key={`text-${index}`}>{part}</span>;
            });

          return <span key="style-replacement">{elements}</span>;
        }
        return content;
      }

      if (Array.isArray(content)) {
        return content.map((item, index) => {
          const processed = replaceInContent(item);
          // Ensure React elements in arrays have keys
          if (React.isValidElement(processed) && processed.key === null) {
            return React.cloneElement(processed, { key: `item-${index}` });
          }
          return processed;
        });
      }

      if (React.isValidElement(content)) {
        const element = content as React.ReactElement<any>;
        const newProps: any = {};

        // Process all props recursively
        Object.keys(element.props || {}).forEach((key) => {
          const processedProp = replaceInContent(element.props[key]);

          // Ensure children arrays have proper keys
          if (key === "children" && Array.isArray(processedProp)) {
            newProps[key] = processedProp.map((child, index) => {
              if (React.isValidElement(child) && child.key === null) {
                return React.cloneElement(child, { key: `child-${index}` });
              }
              return child;
            });
          } else {
            newProps[key] = processedProp;
          }
        });

        return React.cloneElement(element, newProps);
      }

      if (typeof content === "object" && content !== null) {
        const newObj: any = {};
        Object.keys(content).forEach((key) => {
          newObj[key] = replaceInContent(content[key]);
        });
        return newObj;
      }

      return content;
    };

    return replaceInContent(children);
  }, [children]);

  return (
    <TabsPrimitive.Tabs
      selectedKey={value}
      onSelectionChange={(v) => onValueChange(v as string)}
      className="install-tabs mt-4 rounded-md border"
    >
      <TabsPrimitive.TabList className="bg-bg-muted rounded-t-[inherit]">
        {values.map((v, i) => (
          <TabsPrimitive.Tab key={v} id={v}>
            {items[i]}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.TabList>
      {processedChildren}
    </TabsPrimitive.Tabs>
  );
}

function toValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}

export function InstallTab({
  value,
  className,
  ...props
}: TabPanelProps & { value: string }): React.ReactElement {
  return (
    <TabsPrimitive.TabPanel
      id={toValue(value)}
      className={cn(
        "mt-0 overflow-hidden text-xs [&>figure:only-child]:m-0 [&>figure:only-child]:rounded-none [&>figure:only-child]:border-none",
        className,
      )}
      {...props}
    />
  );
}
