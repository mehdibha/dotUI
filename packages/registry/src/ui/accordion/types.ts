import type {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
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
