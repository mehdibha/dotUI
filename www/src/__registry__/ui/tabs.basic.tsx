"use client";

import type { TabListProps as AriaTabListProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { focusRing } from "@/registry/lib/focus-styles";
import { createScopedContext } from "@/registry/lib/utils";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const tabsStyles = tv({
  slots: {
    root: "flex",
    list: "flex",
    tab: [
      focusRing(),
      "text-fg-muted hover:text-fg selected:[&:not([data-disabled])]:text-fg disabled:text-fg-disabled flex cursor-pointer items-center justify-center text-sm whitespace-nowrap transition-colors disabled:cursor-default",
    ],
    panel: focusRing(),
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        list: "",
        panel: "mt-2",
      },
      vertical: {
        root: "flex-row",
        list: "flex-col",
        panel: "ml-2",
      },
    },
    variant: {
      solid: {
        list: "bg-bg-muted gap-1 rounded-lg p-1",
        tab: "selected:bg-bg-inverse/10 disabled:bg-bg-disabled selected:shadow-sm rounded-sm px-3 py-1.5 font-medium",
      },
      underline: {
        tab: "border-transparent p-2.5",
      },
    },
    color: {
      primary: {},
      accent: {},
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      variant: "underline",
      className: {
        list: "border-b",
        tab: "-mb-px border-b-3",
      },
    },
    {
      orientation: "vertical",
      variant: "underline",
      className: {
        list: "border-r",
        tab: "-mr-px border-r-3",
      },
    },
    {
      color: "primary",
      variant: "underline",
      className: {
        tab: "selected:border-bg-primary",
      },
    },
    {
      color: "accent",
      variant: "underline",
      className: {
        tab: "selected:border-bg-accent",
      },
    },
  ],
});

const { root, list, tab, panel } = tabsStyles();

const [TabsProvider, useTabsContext] =
  createScopedContext<VariantProps<typeof tabsStyles>>("Tabs");

interface TabsProps
  extends React.ComponentProps<typeof AriaTabs>,
    VariantProps<typeof tabsStyles> {}
const Tabs = ({
  color = "accent",
  variant = "underline",
  className,
  children,
  ...props
}: TabsProps) => (
  <AriaTabs
    className={composeRenderProps(className, (className, { orientation }) =>
      root({ orientation, className }),
    )}
    {...props}
  >
    {composeRenderProps(children, (children, { orientation }) => (
      <TabsProvider orientation={orientation} variant={variant} color={color}>
        {children}
      </TabsProvider>
    ))}
  </AriaTabs>
);

interface TabListProps<T extends object> extends AriaTabListProps<T> {}
const TabList = <T extends object>({
  className,
  ...props
}: TabListProps<T>) => {
  const { orientation, variant } = useTabsContext("TabList");
  return (
    <AriaTabList
      className={composeRenderProps(className, (className) =>
        list({ variant, orientation, className }),
      )}
      {...props}
    />
  );
};

interface TabProps extends React.ComponentProps<typeof AriaTab> {}
const Tab = ({ className, ...props }: TabProps) => {
  const { orientation, variant, color } = useTabsContext("Tab");
  return (
    <AriaTab
      className={composeRenderProps(className, (className) =>
        tab({ orientation, variant, color, className }),
      )}
      {...props}
    />
  );
};

interface TabPanelProps extends React.ComponentProps<typeof AriaTabPanel> {}
const TabPanel = ({ className, ...props }: TabPanelProps) => {
  const { orientation, variant } = useTabsContext("TabList");
  return (
    <AriaTabPanel
      className={composeRenderProps(className, (className) =>
        panel({ orientation, variant, className }),
      )}
      {...props}
    />
  );
};

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
export { Tabs, TabList, Tab, TabPanel };
