"use client";

import { useMemo, useState, useCallback, useLayoutEffect } from "react";
import * as TabsPrimitive from "@/components/ui/tabs";
import type {
  TabsProps as BaseProps,
  TabPanelProps,
} from "@/components/ui/tabs";

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
    list.filter((item) => item !== listener)
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

export function Tabs({
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
    [groupId, persist]
  );

  return (
    <TabsPrimitive.Tabs
      selectedKey={value}
      onSelectionChange={(v) => onValueChange(v as string)}
      {...props}
    >
      <TabsPrimitive.TabList>
        {values.map((v, i) => (
          <TabsPrimitive.Tab key={v} id={v}>
            {items[i]}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.TabList>
      {props.children}
    </TabsPrimitive.Tabs>
  );
}

function toValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}

export function Tab({
  value,
  ...props
}: TabPanelProps & { value: string }): React.ReactElement {
  return <TabsPrimitive.TabPanel id={toValue(value)} {...props} />;
}
