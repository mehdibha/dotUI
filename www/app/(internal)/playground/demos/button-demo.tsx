import { ArrowRightIcon, SendIcon } from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";

export const ButtonDemo = () => {
  return (["sm", "md", "lg"] as const).map((size) => (
    <div key={size} className="flex flex-wrap items-center gap-2">
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
        <Button key={variant} size={size} variant={variant}>
          {variant}
        </Button>
      ))}
      <Button size={size} prefix={<SendIcon />}>
        Send
      </Button>
      <Button size={size} suffix={<ArrowRightIcon />}>
        Learn more
      </Button>
      <Button size={size} isPending>
        button
      </Button>
    </div>
  ));
};
