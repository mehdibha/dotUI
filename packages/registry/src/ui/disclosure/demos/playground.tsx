"use client";

import type { Control } from "@dotui/registry/playground";

import { Disclosure, DisclosureHeading, DisclosurePanel } from "../index";

interface DisclosurePlaygroundProps {
  heading?: string;
  content?: string;
  isDisabled?: boolean;
  defaultExpanded?: boolean;
}

export function DisclosurePlayground({
  heading = "System requirements",
  content = "Details about system requirements go here. Describes the minimum and recommended hardware and software needed.",
  isDisabled = false,
  defaultExpanded = false,
}: DisclosurePlaygroundProps) {
  return (
    <Disclosure isDisabled={isDisabled} defaultExpanded={defaultExpanded}>
      <DisclosureHeading>{heading}</DisclosureHeading>
      <DisclosurePanel>
        <p className="pb-3">{content}</p>
      </DisclosurePanel>
    </Disclosure>
  );
}

export const disclosureControls: Control[] = [
  {
    type: "string",
    name: "heading",
    label: "Heading",
    defaultValue: "System requirements",
  },
  {
    type: "string",
    name: "content",
    label: "Content",
    defaultValue:
      "Details about system requirements go here. Describes the minimum and recommended hardware and software needed.",
  },
  {
    type: "boolean",
    name: "defaultExpanded",
    label: "Default Expanded",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
];

