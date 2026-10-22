"use client";

import * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as TabsPrimitives from "react-aria-components/Tabs";
import { type VariantProps, tv } from "tailwind-variants";

const tabsVariants = tv({
  slots: {
    root: "flex gap-2 [--tabs-list-height:3rem]",
    list: "inline-flex w-fit items-center justify-center text-fg-muted",
    item: "relative isolate inline-flex flex-1 cursor-default items-center justify-center whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-ui focus-visible:focus-ring-outside text-fg-muted hover:text-fg disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) **:[svg]:pointer-events-none **:[svg]:shrink-0 gap-2 px-4 py-2 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 **:[svg]:not-with-[size]:size-5 font-bold",
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
        list: "rounded-md bg-muted p-[3px]",
        item: "rounded-[calc(var(--radius-md)-3px)] border border-transparent orientation-horizontal:h-[calc(100%-1px)] selected:text-fg-inverse",
        indicator: "inset-0 rounded-[calc(var(--radius-md)-3px)] bg-inverse",
      },
      line: {
        list: "gap-3 orientation-horizontal:border-b orientation-vertical:border-r",
        item: "rounded-sm orientation-horizontal:h-full selected:text-fg",
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
        item: "border border-transparent orientation-horizontal:-mb-px orientation-horizontal:h-full orientation-horizontal:rounded-t-sm orientation-vertical:-mr-px orientation-vertical:rounded-l-sm selected:z-10 selected:border-border selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg orientation-horizontal:selected:border-b-transparent orientation-vertical:selected:border-r-transparent",
        indicator: "hidden",
      },
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const { root, list, item, indicator, panel } = tabsVariants();

type TabsVariant = VariantProps<typeof tabsVariants>["variant"];

/* -------------------------------------------------------------------------- */

const TabsContext = React.createContext<TabsProps["orientation"] | null>(null);
const useTabsContext = (componentName: string) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`${componentName} must be used within Tabs`);
  }
  return context;
};

const TabListContext = React.createContext<TabsVariant | undefined>(undefined);

/* -------------------------------------------------------------------------- */

interface TabsProps extends React.ComponentProps<typeof TabsPrimitives.Tabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
  return (
    <TabsPrimitives.Tabs
      className={composeRenderProps(className, (className, { orientation }) =>
        root({ orientation, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { orientation }) => (
        <TabsContext value={orientation}>{children}</TabsContext>
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
    <TabListContext value={variant}>
      <TabsPrimitives.TabList
        className={composeRenderProps(className, (className, { orientation }) =>
          list({ orientation, variant, className }),
        )}
        {...props}
      />
    </TabListContext>
  );
};

/* -------------------------------------------------------------------------- */

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
  const orientation = useTabsContext("Tab");
  const variant = React.useContext(TabListContext);
  return (
    <TabsPrimitives.Tab
      data-tab=""
      data-orientation={orientation}
      className={composeRenderProps(className, (className) =>
        item({ orientation, variant, className }),
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
  const variant = React.useContext(TabListContext);
  return (
    <SelectionIndicatorPrimitives.SelectionIndicator
      data-tab-indicator=""
      data-orientation={orientation}
      className={composeRenderProps(className, (className) =>
        indicator({ orientation, variant, className }),
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
      className={composeRenderProps(className, (className) =>
        panel({ className }),
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
