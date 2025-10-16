"use client";

import { ArrowRightIcon, SendIcon } from "lucide-react";

import { Button, ButtonProvider } from "@dotui/registry-v2/ui/button";

export const ButtonDemo = () => {
  return (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ButtonProvider key={size} size={size}>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                "default",
                "primary",
                "quiet",
                "link",
                "success",
                "warning",
                "danger",
              ] as const
            ).map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
            <Button>
              <SendIcon />
              Send
            </Button>
            <Button>
              <ArrowRightIcon />
              Learn more
            </Button>
            <Button isPending>button</Button>
          </div>
        </ButtonProvider>
      ))}
    </div>
  );
};
