"use client";

import React from "react";

import { XCircleIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { TextField } from "@dotui/registry/ui/text-field";
import { Tooltip } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <TextField aria-label="Website" prefix={<span>https://</span>} />
      <TextField aria-label="Email" suffix={<span>@dotui.org</span>} />
      <TextField
        aria-label="Textfield with clear input"
        ref={inputRef}
        value={inputValue}
        onChange={setInputValue}
        suffix={
          <Tooltip content="Clear input" placement="bottom" className="text-xs">
            <Button
              variant="quiet"
              shape="square"
              size="sm"
              className="size-6"
              onPress={() => {
                setInputValue("");
                inputRef.current?.focus();
              }}
            >
              <XCircleIcon />
            </Button>
          </Tooltip>
        }
      />
    </div>
  );
}
