"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as TabsPrimitives from "react-aria-components/Tabs";

import { createContext } from "@/lib/context";
import { tv, type VariantProps } from "tailwind-variants";

const tabsVariants = tv({
  slots: {
    root: "flex gap-2 [--tabs-list-height:2rem]",
    list: "inline-flex w-fit items-center justify-center text-fg-muted",
    tab: "relative isolate inline-flex flex-1 cursor-default items-center justify-center font-medium whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] select-ui focus-visible:focus-ring text-fg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 **:[svg]:pointer-events-none **:[svg]:shrink-0 gap-1.5 px-1.5 py-0.5 text-sm has-data-icon-end:pr-1 has-data-icon-start:pl-1 **:[svg]:not-with-[size]:size-4",
    selectionIndicator:
      "pointer-events-none absolute ease-out motion-safe:transition-[translate,width,height]",
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
        tab: "w-full justify-start",
      },
    },
    variant: {
      segmented: {
        list: "rounded-lg bg-muted p-[3px]",
        tab: "rounded-md border border-transparent orientation-horizontal:h-[calc(100%-1px)] selected:text-fg-on-selected",
        selectionIndicator: "inset-0 rounded-md bg-selected shadow-sm",
      },
      line: {
        list: "gap-3 orientation-horizontal:border-b orientation-vertical:border-r",
        tab: "rounded-md orientation-horizontal:h-full selected:text-fg",
        selectionIndicator:
          "rounded-full bg-fg orientation-horizontal:-bottom-px orientation-horizontal:left-0 orientation-horizontal:h-0.5 orientation-horizontal:w-full orientation-vertical:top-0 orientation-vertical:-right-px orientation-vertical:h-full orientation-vertical:w-0.5",
      },
      pill: {
        list: "gap-1",
        tab: "rounded-full orientation-horizontal:h-full selected:text-fg",
        selectionIndicator: "inset-0 rounded-full bg-muted",
      },
      enclosed: {
        list: "orientation-horizontal:items-end orientation-horizontal:border-b orientation-vertical:border-r",
        tab: "border border-transparent orientation-horizontal:-mb-px orientation-horizontal:h-full orientation-horizontal:rounded-t-lg orientation-vertical:-mr-px orientation-vertical:rounded-l-lg selected:z-10 selected:border-border selected:bg-bg selected:text-fg orientation-horizontal:selected:border-b-transparent orientation-vertical:selected:border-r-transparent",
        selectionIndicator: "hidden",
      },
    },
  },
  defaultVariants: {
    variant: "segmented",
  },
});
const { root, list, tab, selectionIndicator, panel } = tabsVariants();

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
        tab({ orientation, variant, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <TabIndicator />
          <span
            data-tab-content=""
            className="relative z-10 inline-flex items-center [gap:inherit]"
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
        selectionIndicator({ orientation, variant, className: cn }),
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
