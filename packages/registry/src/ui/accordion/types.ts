import type {
  DisclosureGroup as AriaDisclosureGroup,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from "react-aria-components";

export interface AccordionProps
  extends React.ComponentProps<typeof AriaDisclosureGroup> {}

export interface AccordionItemProps
  extends React.ComponentProps<typeof AriaDisclosure> {}

export interface AccordionPanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}

export interface AccordionHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}

