"use client";

import { CheckIcon } from "lucide-react";
import {
  Tabs,
  TabList,
  TabPanel,
  Tab,
  type TabsProps as BaseProps,
  type TabPanelProps,
} from "react-aria-components";
import { cn } from "@/registry/ui/default/lib/cn";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";

export interface TabsProps extends Omit<BaseProps, "children"> {
  children: React.ReactNode;
  items: {
    value: string;
    title: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
}

export function Choices({ items, ...props }: TabsProps): React.ReactElement {
  return (
    <Tabs {...props}>
      <TabList className="grid grid-cols-3 gap-2 mb-4">
        {items.map((item, i) => (
          <Tab
            key={item.value}
            className={cn(
              focusRing(),
              "selected:bg-bg-muted relative cursor-pointer rounded-md border p-4 transition-colors duration-100"
            )}
            id={item.value}
          >
            {({ isSelected }) => (
              <>
                <div className="flex items-center gap-2 [&>svg]:size-6">
                  {item.icon}
                  <span className="text-md font-semibold">{item.title}</span>
                </div>
                <p className="text-fg-muted mt-2 text-sm">{item.description}</p>
                <div
                  className={cn(
                    "border-border-control absolute right-4 top-4 flex size-6 shrink-0 items-center justify-center rounded-full border [&_svg]:size-4",
                    isSelected && "bg-bg-accent text-fg-onAccent"
                  )}
                >
                  {isSelected && <CheckIcon />}
                </div>
              </>
            )}
          </Tab>
        ))}
      </TabList>
      {props.children}
    </Tabs>
  );
}

export function Choice(props: TabPanelProps) {
  return <TabPanel {...props} />;
}
