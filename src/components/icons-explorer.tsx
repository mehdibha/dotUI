import React from "react";
import { SearchIcon } from "lucide-react";
import * as icons from "lucide-static";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const IconsExplorer = () => {
  return (
    <div>
      <div className="relative">
        <Input className="full-w pl-12" placeholder={`Search icons`} />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
      <div className="grid-cols-18 mt-6 grid gap-3">
        {Object.keys(icons).map((name, index) => {
          const svgStr = icons[name as keyof typeof icons];
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="flex aspect-square cursor-pointer items-center justify-center rounded-md bg-card hover:bg-card/60"
                  dangerouslySetInnerHTML={{ __html: svgStr }}
                />
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
