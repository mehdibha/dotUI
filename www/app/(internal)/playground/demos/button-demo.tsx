"use client";

import React from "react";
import { ArrowRightIcon, SendIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

export const ButtonDemo = () => {
  return (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <React.Fragment key={size}>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                "default",
                "primary",
                "quiet",
                "link",
                "warning",
                "danger",
              ] as const
            ).map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
            <Button size={size}>
              <SendIcon />
              Send
            </Button>
            <Button size={size}>
              <ArrowRightIcon />
              Learn more
            </Button>
            <Button isPending size={size}>
              button
            </Button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
