"use client";

import { CheckIcon } from "lucide-react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import type {
  TabsProps as BaseProps,
  TabPanelProps,
} from "react-aria-components";

import { focusRing } from "@dotui/ui/lib/focus-styles";
import { cn } from "@dotui/ui/lib/utils";

export interface ChoicesProps extends Omit<BaseProps, "children"> {
  children: React.ReactNode;
  items: {
    value: string;
    title: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
}

export function Choices({ items, ...props }: ChoicesProps): React.ReactElement {
  return (
    <Tabs {...props}>
      <TabList className="mb-4 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Tab
            key={item.value}
            className={cn(
              focusRing(),
              "relative cursor-pointer rounded-md border p-4 transition-colors duration-100 hover:bg-bg-muted/50 selected:bg-bg-muted",
            )}
            id={item.value}
          >
            {({ isSelected }) => (
              <>
                <div className="flex items-center gap-2 [&>svg]:size-6">
                  {item.icon}
                  <span className="text-base font-semibold">{item.title}</span>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{item.description}</p>
                <div
                  className={cn(
                    "absolute top-2 right-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-border-control [&_svg]:size-3",
                    isSelected && "bg-bg-accent text-fg-on-accent",
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
