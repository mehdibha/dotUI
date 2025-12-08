"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { findNeighbour } from "fumadocs-core/page-tree";
import type { Route } from "next";

import { LinkButton } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
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
        <LinkButton
          aria-label="Go to previous page"
          size="sm"
          isDisabled={!previous}
          href={previous?.url as Route}
        >
          <ChevronLeftIcon />
        </LinkButton>
        <TooltipContent>{previous?.name}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <LinkButton
          aria-label="Go to next page"
          size="sm"
          isDisabled={!next}
          href={next?.url as Route}
        >
          <ChevronRightIcon />
        </LinkButton>
        <TooltipContent>{next?.name}</TooltipContent>
      </Tooltip>
    </Group>
  );
};
