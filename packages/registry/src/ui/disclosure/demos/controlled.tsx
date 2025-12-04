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
    <div className="flex flex-col items-center gap-4">
      <Button onPress={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
      <Disclosure
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        className="max-w-xs"
      >
        <DisclosureTrigger>Controlled disclosure</DisclosureTrigger>
        <DisclosurePanel>
          This disclosure is controlled externally. You can toggle it using the
          button above or by clicking the disclosure heading.
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
