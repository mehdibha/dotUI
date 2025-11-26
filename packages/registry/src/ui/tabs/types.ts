import type {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  SelectionIndicator as AriaSelectionIndicator,
} from "react-aria-components";

export interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

export interface TabListProps
  extends React.ComponentProps<typeof AriaTabList> {}

export interface TabProps extends React.ComponentProps<typeof AriaTab> {}

export interface TabPanelProps
  extends React.ComponentProps<typeof AriaTabPanel> {}

export interface TabIndicatorProps
  extends React.ComponentProps<typeof AriaSelectionIndicator> {}

