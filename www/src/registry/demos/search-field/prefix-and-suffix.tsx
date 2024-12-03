"use client";

import { Button } from "@/components/dynamic-core/button";
import { SearchField } from "@/components/dynamic-core/search-field";
import { Tooltip } from "@/components/dynamic-core/tooltip";
import { XCircleIcon } from "@/__icons__";

export default function Demo() {
  return (
    <SearchField
      defaultValue="Hello world!"
      prefix="🔍"
      suffix={({ isEmpty, isDisabled }) => {
        if (isEmpty || isDisabled) return null;
        return (
          <Tooltip content="Clear input" className="text-xs">
            <Button variant="quiet" shape="square" size="sm" className="size-6">
              <XCircleIcon />
            </Button>
          </Tooltip>
        );
      }}
    />
  );
}
