"use client";

import type { Route } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { findNeighbour } from "fumadocs-core/page-tree";

import { buttonStyles } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Link } from "@dotui/registry/ui/link";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export const DocsPager = ({
  neighbours,
}: {
  neighbours: ReturnType<typeof findNeighbour>;
}) => {
  const { previous, next } = neighbours;

  return (
    <Group>
      <Tooltip>
        <Link
          data-slot="button"
          data-icon-only=""
          aria-label="Go to previous page"
          className={buttonStyles({ size: "sm" })}
          isDisabled={!previous}
          href={previous?.url as Route}
        >
          <ChevronLeftIcon />
        </Link>
        <TooltipContent>{previous?.name}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <Link
          data-slot="button"
          aria-label="Go to next page"
          data-icon-only=""
          className={buttonStyles({ size: "sm" })}
          isDisabled={!next}
          href={next?.url as Route}
        >
          <ChevronRightIcon />
        </Link>
        <TooltipContent>{next?.name}</TooltipContent>
      </Tooltip>
    </Group>
  );
};
