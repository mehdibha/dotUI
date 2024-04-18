"use client";

import React from "react";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Input } from "@/lib/components/core/default/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/core/default/tooltip";

export default function InputSearchDemo() {
  const [searchInput, setSearchInput] = React.useState("");

  return (
    <Input
      prefix={<SearchIcon />}
      value={searchInput}
      onChange={(e) => {
        setSearchInput(e.target.value);
      }}
      onFocus={() => {
        console.log("focus");
      }}
      onBlur={() => {
        console.log("blur");
      }}
      suffix={
        searchInput && (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                shape="circle"
                size="sm"
                className="h-6 w-6"
                onClick={() => {
                  setSearchInput("");
                }}
              >
                <XCircleIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Clear search</TooltipContent>
          </Tooltip>
        )
      }
    />
  );
}
