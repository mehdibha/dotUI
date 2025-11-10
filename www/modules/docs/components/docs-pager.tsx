import type { Route } from "next";
import Link from "next/link";
import { findNeighbour } from "fumadocs-core/page-tree";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { docsSource } from "@/modules/docs/lib/source";

export const DocsPager = ({ currentPathname }: { currentPathname: string }) => {
  const { previous, next } = findNeighbour(
    docsSource.pageTree,
    currentPathname,
  );

  return (
    <Group>
      {previous ? (
        <Tooltip>
          <Button asChild aria-label="Go to previous page" size="sm">
            <Link href={previous.url as Route}>
              <ChevronLeftIcon />
              {/* {previous.name} */}
            </Link>
          </Button>
          <TooltipContent>{previous.name}</TooltipContent>
        </Tooltip>
      ) : (
        <div />
      )}
      {next ? (
        <Tooltip>
          <Button asChild aria-label="Go to next page" size="sm">
            <Link href={next.url as Route}>
              {/* {next.name} */}
              <ChevronRightIcon />
            </Link>
          </Button>
          <TooltipContent>{next.name}</TooltipContent>
        </Tooltip>
      ) : (
        <div />
      )}
    </Group>
  );
};
