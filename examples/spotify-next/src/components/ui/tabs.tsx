"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as TabsPrimitives from "react-aria-components/Tabs";

import { createContext } from "@/lib/context";
import { tv } from "tailwind-variants";

const tabsVariants = tv({
  slots: {
    root: "flex gap-2 [--tabs-list-height:3rem]",
    list: "inline-flex w-fit items-center justify-center text-fg-muted",
    item: "relative isolate inline-flex flex-1 cursor-default items-center justify-center whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-ui focus-visible:focus-ring-outside text-fg-muted hover:text-fg disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) aria-disabled:cursor-disabled aria-disabled:text-(--disabled-fg,currentColor) **:[svg]:pointer-events-none **:[svg]:shrink-0 gap-2 px-4 py-2 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 **:[svg]:not-with-[size]:size-5 font-bold",
    indicator:
      "pointer-events-none absolute transition-[translate,width,height] motion-reduce:transition-none",
    panel: "flex-1 outline-none data-[inert=true]:hidden text-sm",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        list: "h-(--tabs-list-height) flex-row",
      },
      vertical: {
        root: "flex-row",
        list: "h-fit flex-col",
        item: "w-full justify-start",
      },
    },
    variant: {
      segmented: {
        list: "rounded-lg bg-muted p-[3px]",
        item: "rounded-[calc(var(--radius-lg)-3px)] border border-transparent orientation-horizontal:h-[calc(100%-1px)] selected:text-fg-inverse",
        indicator: "inset-0 rounded-[calc(var(--radius-lg)-3px)] bg-inverse",
      },
      line: {
        list: "gap-3 orientation-horizontal:border-b orientation-vertical:border-r",
        item: "rounded-md orientation-horizontal:h-full selected:text-fg",
        indicator:
          "orientation-horizontal:-bottom-px orientation-vertical:top-0 orientation-vertical:-right-px orientation-vertical:h-full orientation-vertical:w-0.5 orientation-vertical:rounded-full bg-accent orientation-horizontal:h-[3px] orientation-horizontal:rounded-t-[3px] orientation-horizontal:inset-x-4",
      },
      pill: {
        list: "gap-1",
        item: "group/tab rounded-sm orientation-horizontal:h-full selected:text-fg-inverse",
        indicator:
          "inset-0 rounded-sm bg-inverse group-hover/tab:bg-inverse/90 group-pressed/tab:bg-inverse/80",
      },
      enclosed: {
        list: "orientation-horizontal:items-end orientation-horizontal:border-b orientation-vertical:border-r",
        item: "border border-transparent orientation-horizontal:-mb-px orientation-horizontal:h-full orientation-horizontal:rounded-t-lg orientation-vertical:-mr-px orientation-vertical:rounded-l-lg selected:z-10 selected:border-border selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg orientation-horizontal:selected:border-b-transparent orientation-vertical:selected:border-r-transparent",
        indicator: "hidden",
      },
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const { root, list, item, indicator, panel } = tabsVariants();

type TabsVariant = "segmented" | "line" | "pill" | "enclosed";

/* -------------------------------------------------------------------------- */

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
  name: "TabsContext",
});

// Unset, the design system's tab style applies.
const [TabListProvider, useTabListContext] = createContext<
  TabsVariant | undefined
>({
  name: "TabListContext",
  strict: false,
});

/* -------------------------------------------------------------------------- */

interface TabsProps extends React.ComponentProps<typeof TabsPrimitives.Tabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
  return (
    <TabsPrimitives.Tabs
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { orientation }) => (
        <TabsProvider value={orientation}>{children}</TabsProvider>
      ))}
    </TabsPrimitives.Tabs>
  );
};

/* -------------------------------------------------------------------------- */

interface TabListProps extends React.ComponentProps<
  typeof TabsPrimitives.TabList
> {
  variant?: TabsVariant;
}

const TabList = ({ className, variant, ...props }: TabListProps) => {
  return (
    <TabListProvider value={variant}>
      <TabsPrimitives.TabList
        className={composeRenderProps(className, (cn, { orientation }) =>
          list({ orientation, variant, className: cn }),
        )}
        {...props}
      />
    </TabListProvider>
  );
};

/* -------------------------------------------------------------------------- */

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
  const orientation = useTabsContext("Tab");
  const variant = useTabListContext("Tab");
  return (
    <TabsPrimitives.Tab
      data-tab=""
      data-orientation={orientation}
      className={composeRenderProps(className, (cn) =>
        item({ orientation, variant, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <TabIndicator />
          <span
            data-tab-content=""
            className="relative z-10 inline-flex items-center gap-[inherit]"
          >
            {children}
          </span>
        </>
      ))}
    </TabsPrimitives.Tab>
  );
};

/* -------------------------------------------------------------------------- */

interface TabIndicatorProps extends React.ComponentProps<
  typeof SelectionIndicatorPrimitives.SelectionIndicator
> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
  const orientation = useTabsContext("TabIndicator");
  const variant = useTabListContext("TabIndicator");
  return (
    <SelectionIndicatorPrimitives.SelectionIndicator
      data-tab-indicator=""
      data-orientation={orientation}
      className={composeRenderProps(className, (cn) =>
        indicator({ orientation, variant, className: cn }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface TabPanelProps extends React.ComponentProps<
  typeof TabsPrimitives.TabPanel
> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
  return (
    <TabsPrimitives.TabPanel
      data-tab-panel
      className={composeRenderProps(className, (cn) =>
        panel({ className: cn }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  TabIndicatorProps,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
};
export { Tab, TabIndicator, TabList, TabPanel, Tabs };
