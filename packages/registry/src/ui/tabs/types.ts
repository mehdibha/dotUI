import type {
  SelectionIndicator as AriaSelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";

/**
 * Tabs organize content into multiple sections and allow users to navigate between them.
 */
export interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

/**
 * A TabList is used within Tabs to group tabs that a user can switch between.
 */
export interface TabListProps
  extends React.ComponentProps<typeof AriaTabList> {}

/**
 * A Tab provides a title for an individual item within a TabList.
 */
export interface TabProps extends React.ComponentProps<typeof AriaTab> {}

/**
 * A TabPanel provides the content for a tab.
 */
export interface TabPanelProps
  extends React.ComponentProps<typeof AriaTabPanel> {}

/**
 * An animated indicator of selection state within a group of items.
 */
export interface TabIndicatorProps
  extends React.ComponentProps<typeof AriaSelectionIndicator> {}
