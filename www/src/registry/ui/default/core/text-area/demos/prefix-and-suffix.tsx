"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { TextArea } from "@/registry/ui/default/core/text-area";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";
import { BoldIcon, ItalicIcon } from "@/__icons__";

export default function Demo() {
  const [inputValue, setInputValue] = React.useState("");
  return (
    <TextArea
      label="Comment"
      placeholder="type something here"
      value={inputValue}
      onChange={setInputValue}
      prefix={
        <div className="flex items-center gap-1">
          <Button
            variant="quiet"
            shape="square"
            size="sm"
            className="size-7"
            onPress={() => {
              setInputValue(`${inputValue}👍`);
            }}
          >
            👍
          </Button>
          <Button
            variant="quiet"
            shape="square"
            size="sm"
            className="size-7"
            onPress={() => {
              setInputValue(`${inputValue}❤️`);
            }}
          >
            ❤️
          </Button>
        </div>
      }
      suffix={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <ToggleButton size="sm" className="size-7">
              <BoldIcon />
            </ToggleButton>
            <ToggleButton size="sm" className="size-7">
              <ItalicIcon />
            </ToggleButton>
          </div>
          <Button variant="primary" size="sm" className="h-7">
            Comment
          </Button>
        </div>
      }
    />
  );
}
