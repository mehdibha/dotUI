import { source } from "@/app/source";
import { findNeighbour } from "fumadocs-core/server";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";

export const DocsPager = ({ currentPathname }: { currentPathname: string }) => {
  const { previous, next } = findNeighbour(source.pageTree, currentPathname);

  return (
    <div className="flex items-center justify-between">
      {previous ? (
        <Button
          href={previous.url}
          prefix={<ChevronLeftIcon />}
          variant="quiet"
          size="sm"
        >
          {previous.name}
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button
          href={next.url}
          suffix={<ChevronRightIcon />}
          variant="quiet"
          size="sm"
        >
          {next.name}
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
};
