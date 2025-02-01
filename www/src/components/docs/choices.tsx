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
import { focusRing } from "@/lib/focus-styles";
import { cn } from "@/lib/utils";

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
        {items.map((item, i) => (
          <Tab
            key={item.value}
            className={cn(
              focusRing(),
              "selected:bg-bg-muted hover:bg-bg-muted/50 relative cursor-pointer rounded-md border p-4 transition-colors duration-100"
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
                    "border-border-control absolute right-2 top-2 flex size-4 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3",
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
