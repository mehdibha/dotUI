"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  const [isExpanded, setExpanded] = React.useState(false);

  return (
    <div className="w-full space-y-3">
      <Disclosure isExpanded={isExpanded} onExpandedChange={setExpanded}>
        <DisclosureTrigger>System requirements</DisclosureTrigger>
        <DisclosurePanel>
          Details about system requirements go here. Describes the minimum and
          recommended hardware and software needed.
        </DisclosurePanel>
      </Disclosure>
      <Button size="sm" onPress={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
      <p className="text-fg-muted text-sm">
        Expanded: {isExpanded ? "true" : "false"}{" "}
      </p>
    </div>
  );
}
