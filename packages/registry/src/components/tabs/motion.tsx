"use client";

import type { Transition } from "motion/react";
import type { TabListProps as AriaTabListProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { focusRing } from "@/lib/focus-styles";
import { createScopedContext } from "@/lib/utils";
import { LayoutGroup, motion } from "motion/react";
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
    root: "group flex",
    list: "flex",
    tab: [
      focusRing(),
      "text-fg-muted hover:text-fg selected:[&:not([data-disabled])]:text-fg disabled:text-fg-disabled relative flex cursor-pointer items-center justify-center text-sm whitespace-nowrap transition-colors disabled:cursor-default",
    ],
    cursor: "bg-bg-accent absolute",
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
        tab: "rounded-sm px-3 py-1.5 font-medium",
        cursor: "bg-bg-inverse/10 inset-0 z-0 rounded-[inherit] shadow-sm",
      },
      underline: {
        tab: "selected:border-bg-accent border-transparent px-3 py-[7px]",
        cursor: "",
      },
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      variant: "underline",
      className: {
        list: "border-b",
        cursor: "inset-x-0 bottom-0 h-[2px] origin-[50%_50%_0] transform-none",
      },
    },
    {
      orientation: "vertical",
      variant: "underline",
      className: {
        list: "border-r",
        cursor: "inset-y-0 right-0 w-[2px]",
      },
    },
  ],
});

const { root, list, tab, panel, cursor } = tabsStyles();

const TRANSITION: Transition = { type: "spring", bounce: 0.05, duration: 0.3 };

const [TabsProvider, useTabsContext] =
  createScopedContext<VariantProps<typeof tabsStyles>>("Tabs");

interface TabsProps
  extends React.ComponentProps<typeof AriaTabs>,
    VariantProps<typeof tabsStyles> {}
const Tabs = ({
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
      <TabsProvider orientation={orientation} variant={variant}>
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
  const layoutId = React.useId();
  return (
    <LayoutGroup id={layoutId}>
      <AriaTabList
        className={composeRenderProps(className, (className) =>
          list({ variant, orientation, className }),
        )}
        {...props}
      />
    </LayoutGroup>
  );
};

interface TabProps extends React.ComponentProps<typeof AriaTab> {}
const Tab = ({ children, className, ...props }: TabProps) => {
  const { orientation, variant } = useTabsContext("Tab");
  return (
    <AriaTab
      className={composeRenderProps(className, (className) =>
        tab({ orientation, variant, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected && (
            <motion.span
              layoutDependency={false}
              layoutId="cursor"
              transition={TRANSITION}
              className={cursor({ orientation, variant })}
            />
          )}
          {children}
        </>
      ))}
    </AriaTab>
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
