import type * as SelectionIndicatorPrimitives from 'react-aria-components/SelectionIndicator'
import type * as TabsPrimitives from 'react-aria-components/Tabs'

type TabsVariant = 'default' | 'line'

/**
 * Tabs organize content into multiple sections and allow users to navigate between them.
 */
export interface TabsProps extends React.ComponentProps<
  typeof TabsPrimitives.Tabs
> {}

/**
 * A TabList is used within Tabs to group tabs that a user can switch between.
 */
export interface TabListProps extends React.ComponentProps<
  typeof TabsPrimitives.TabList
> {
  /**
   * The visual style of the tab list.
   *
   * @default "default"
   */
  variant?: TabsVariant
}

/**
 * A Tab provides a title for an individual item within a TabList.
 */
export interface TabProps extends React.ComponentProps<
  typeof TabsPrimitives.Tab
> {}

/**
 * A TabPanel provides the content for a tab.
 */
export interface TabPanelProps extends React.ComponentProps<
  typeof TabsPrimitives.TabPanel
> {}

/**
 * An animated indicator of selection state within a group of items.
 */
export interface TabIndicatorProps extends React.ComponentProps<
  typeof SelectionIndicatorPrimitives.SelectionIndicator
> {}
