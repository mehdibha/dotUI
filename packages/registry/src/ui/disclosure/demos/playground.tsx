"use client";

import type { Control } from "@dotui/registry/playground";

import { Disclosure, DisclosurePanel, DisclosureTrigger } from "../index";

interface DisclosurePlaygroundProps {
  isDisabled?: boolean;
  defaultExpanded?: boolean;
}

export function DisclosurePlayground({
  isDisabled = false,
  defaultExpanded = false,
}: DisclosurePlaygroundProps) {
  return (
    <Disclosure isDisabled={isDisabled} defaultExpanded={defaultExpanded}>
      <DisclosureTrigger>System requirements</DisclosureTrigger>
      <DisclosurePanel>
        Details about system requirements go here. Describes the minimum and
        recommended hardware and software needed.
      </DisclosurePanel>
    </Disclosure>
  );
}

export const disclosureControls: Control[] = [
  {
    type: "boolean",
    name: "defaultExpanded",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
];
