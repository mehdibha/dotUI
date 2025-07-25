"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { TextField } from "@/components/dynamic-ui/text-field";
import { Tooltip } from "@/components/dynamic-ui/tooltip";
import { XCircleIcon } from "lucide-react";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <TextField prefix={<span>https://</span>} />
      <TextField suffix={<span>@dotui.org</span>} />
      <TextField
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
