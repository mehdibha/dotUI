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
              "hover:bg-bg-card selected:bg-bg-muted relative cursor-pointer rounded-md border p-4 transition-colors duration-100",
            )}
            id={item.value}
          >
            {({ isSelected }) => (
              <>
                <div className="flex items-center gap-2 [&>svg]:size-6">
                  {item.icon}
                  <span className="text-base font-semibold">{item.title}</span>
                </div>
                <p className="text-fg-muted mt-2 text-sm">{item.description}</p>
                <div
                  className={cn(
                    "border-border-control absolute right-2 top-2 flex size-4 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3",
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
