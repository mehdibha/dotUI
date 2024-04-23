"use client";

import type { PopoverContentProps } from "@radix-ui/react-popover";
import { InfoIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/core/default/popover";

export const Info = ({ children, ...props }: PopoverContentProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" shape="square" size="sm" className="h-6 w-6">
        <InfoIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent side="top" {...props} className={props.className}>
      {children}
    </PopoverContent>
  </Popover>
);
