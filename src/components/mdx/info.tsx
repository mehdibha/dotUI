"use client";

import { InfoIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { PopoverRoot, Popover, type PopoverProps } from "@/lib/components/core/default/popover";

export const Info = ({ children, ...props }: PopoverProps) => (
  <PopoverRoot>
    <Button variant="ghost" shape="square" size="sm" className="h-6 w-6">
      <InfoIcon />
    </Button>
    <Popover {...props} className={props.className}>
      {children}
    </Popover>
  </PopoverRoot>
);
