"use client";

import React from "react";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Input } from "@/lib/components/core/default/input";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function InputSearchDemo() {
  const [searchInput, setSearchInput] = React.useState("");

  return (
    <Input
      prefix={<SearchIcon />}
      value={searchInput}
      onChange={(e) => {
        setSearchInput(e.target.value);
      }}
      suffix={
        searchInput && (
          <Tooltip content="Clear search" side="bottom" className="text-xs">
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
          </Tooltip>
        )
      }
    />
  );
}
