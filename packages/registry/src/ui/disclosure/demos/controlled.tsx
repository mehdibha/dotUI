"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import {
  Disclosure,
  DisclosureHeading,
  DisclosurePanel,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  const [isExpanded, setExpanded] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onPress={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"}
      </Button>
      <Disclosure isExpanded={isExpanded} onExpandedChange={setExpanded}>
        <DisclosureHeading>Controlled disclosure</DisclosureHeading>
        <DisclosurePanel>
          <p className="pb-3">
            This disclosure is controlled externally. You can toggle it using
            the button above or by clicking the disclosure heading.
          </p>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

