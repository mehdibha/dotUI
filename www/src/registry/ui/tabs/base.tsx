"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator"
import * as TabsPrimitives from "react-aria-components/Tabs"

import { useStyles } from "./styles"

// MARK: tabsStyles

type TabsVariant = "segmented" | "line" | "pill" | "enclosed"

// MARK: Separator

const TabsContext = React.createContext<TabsProps["orientation"] | null>(null)
const useTabsContext = (componentName: string) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error(`${componentName} must be used within Tabs`)
  }
  return context
}

const TabListContext = React.createContext<TabsVariant | undefined>(undefined)

// MARK: Separator

interface TabsProps extends React.ComponentProps<typeof TabsPrimitives.Tabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
  const { root } = useStyles()()
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
  )
}

// MARK: Separator

interface TabListProps extends React.ComponentProps<
  typeof TabsPrimitives.TabList
> {
  variant?: TabsVariant
}

const TabList = ({ className, variant, ...props }: TabListProps) => {
  const { list } = useStyles()()
  return (
    <TabListContext value={variant}>
      <TabsPrimitives.TabList
        className={composeRenderProps(className, (className, { orientation }) =>
          list({ orientation, variant, className }),
        )}
        {...props}
      />
    </TabListContext>
  )
}

// MARK: Separator

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
  const { item } = useStyles()()
  const orientation = useTabsContext("Tab")
  const variant = React.useContext(TabListContext)
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
  )
}

// MARK: Separator

interface TabIndicatorProps extends React.ComponentProps<
  typeof SelectionIndicatorPrimitives.SelectionIndicator
> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
  const { indicator } = useStyles()()
  const orientation = useTabsContext("TabIndicator")
  const variant = React.useContext(TabListContext)
  return (
    <SelectionIndicatorPrimitives.SelectionIndicator
      data-tab-indicator=""
      data-orientation={orientation}
      className={composeRenderProps(className, (className) =>
        indicator({ orientation, variant, className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface TabPanelProps extends React.ComponentProps<
  typeof TabsPrimitives.TabPanel
> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
  const { panel } = useStyles()()
  return (
    <TabsPrimitives.TabPanel
      data-tab-panel
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type {
  TabIndicatorProps,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
}
export { Tab, TabIndicator, TabList, TabPanel, Tabs }
