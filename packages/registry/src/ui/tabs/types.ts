import type {
  SelectionIndicator as AriaSelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";

export interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

export interface TabListProps
  extends React.ComponentProps<typeof AriaTabList> {}

export interface TabProps extends React.ComponentProps<typeof AriaTab> {}

export interface TabPanelProps
  extends React.ComponentProps<typeof AriaTabPanel> {}

export interface TabIndicatorProps
  extends React.ComponentProps<typeof AriaSelectionIndicator> {}
