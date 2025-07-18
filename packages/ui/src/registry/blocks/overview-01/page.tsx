import React from "react";

import { Button } from "@dotui/ui/components/button";
import { ExternalLinkIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";
import { LoginForm } from "@dotui/ui/registry/blocks/login-01/components/login-form";

export default function Page() {
  return (
    <div className="container max-w-screen-2xl space-y-4 py-10">
      <Section
        title="Button"
        docs="/docs/components/buttons/button"
        className="space-y-4"
      >
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="flex items-center gap-2">
            <Button size={size} variant="default">
              Default
            </Button>
            <Button size={size} variant="primary">
              Primary
            </Button>
            <Button size={size} variant="accent">
              Accent
            </Button>
            <Button size={size} variant="quiet">
              Quiet
            </Button>
            <Button size={size} variant="success">
              Success
            </Button>
            <Button size={size} variant="danger">
              Danger
            </Button>
            <Button size={size} variant="warning">
              Warning
            </Button>
          </div>
        ))}
      </Section>
    </div>
  );
}

const Section = ({
  title,
  docs,
  className,
  ...props
}: {
  title: string;
  docs?: string;
} & React.ComponentProps<"div">) => {
  return (
    <div className="rounded-sm border">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        {docs && (
          <Button
            href={docs}
            aria-label={`Go to ${title.toLowerCase()} page`}
            variant="quiet"
            shape="square"
            target="_blank"
            size="sm"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className={cn("min-h-32 p-4", className)} {...props} />
    </div>
  );
};
