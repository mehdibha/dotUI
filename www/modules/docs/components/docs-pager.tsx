import { findNeighbour } from "fumadocs-core/server";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "next";

import { Button } from "@dotui/ui/components/button";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { docsSource } from "@/modules/docs/lib/source";

export const DocsPager = ({
  variant = "label",
  currentPathname,
}: {
  variant?: "tooltip" | "label";
  currentPathname: string;
}) => {
  const { previous, next } = findNeighbour(
    docsSource.pageTree,
    currentPathname,
  );

  return (
    <div className="flex items-center justify-between gap-2">
      {previous ? (
        <Tooltip content={previous.name} isDisabled={variant === "label"}>
          <Button
            href={previous.url as Route}
            aria-label={
              variant === "tooltip" ? `Go to previous page` : undefined
            }
            prefix={variant === "label" ? <ChevronLeftIcon /> : undefined}
            shape={variant === "tooltip" ? "square" : undefined}
            variant={variant === "tooltip" ? "default" : "quiet"}
            size="sm"
          >
            {variant === "label" ? previous.name : <ChevronLeftIcon />}
          </Button>
        </Tooltip>
      ) : (
        <div />
      )}
      {next ? (
        <Tooltip content={next.name} isDisabled={variant === "label"}>
          <Button
            href={next.url as Route}
            aria-label={variant === "tooltip" ? `Go to next page` : undefined}
            suffix={variant === "label" ? <ChevronRightIcon /> : undefined}
            shape={variant === "tooltip" ? "square" : undefined}
            variant={variant === "tooltip" ? "default" : "quiet"}
            size="sm"
          >
            {variant === "label" ? next.name : <ChevronRightIcon />}
          </Button>
        </Tooltip>
      ) : (
        <div />
      )}
    </div>
  );
};
