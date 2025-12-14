import type { DisclosureGroup as AriaDisclosureGroup } from "react-aria-components";

/**
 * A DisclosureGroup is a grouping of related disclosures, sometimes called an accordion.
 * It supports both single and multiple expanded items.
 */
export interface AccordionProps
  extends React.ComponentProps<typeof AriaDisclosureGroup> {}
