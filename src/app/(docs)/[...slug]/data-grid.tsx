"use client";

import React from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/classes";
import { type Item } from "@/utils/docs";
import { truncateOnWord } from "@/utils/string";
import { useDebounce } from "@/lib/hooks/use-debounce";

export const DataGrid = ({
  type,
  items,
  className,
}: {
  type: string;
  items: Item[];
  className?: string;
}) => {
  return (
    <div className={className}>
      <div className="relative">
        <Input className="full-w pl-12" placeholder={`Search ${items.length} ${type}`} />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
      <div
        className={cn("mt-4 grid gap-4", {
          "grid-cols-3": type === "components" || type === "hooks",
          "grid-cols-4": type === "templates" || type === "blocks",
          "grid-cols-8": type === "icons",
        })}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.metadata.externalLink ?? item.href}
            target={item.metadata.externalLink ? "_blank" : undefined}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-md border border-border/20 bg-card/70 transition-colors duration-150 hover:border-border hover:bg-card"
          >
            <Thumbnail
              thumbnail={item.metadata.thumbnail}
              title={item.metadata.title}
              aspect="component"
            />
            <div className={cn("flex flex-1 flex-col p-4", {})}>
              <div className="flex-1">
                <p className="text-lg font-semibold">{item.metadata.title}</p>
                {item.metadata.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {truncateOnWord(item.metadata.description, 70)}
                  </p>
                )}
              </div>
              {item.metadata.keywords && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.metadata.keywords
                    .slice(0, item.metadata.keywords.length > 3 ? 2 : 3)
                    .map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  {item.metadata.keywords.length > 3 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-muted-foreground">
                          +{item.metadata.keywords.length - 2} more
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="pl-6">
                        <ul className="list-disc">
                          {item.metadata.keywords.slice(2).map((keyword, index) => (
                            <li key={index}>{keyword}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Thumbnail = ({
  // title,
  thumbnail,
  // aspect,
}: {
  title: string;
  thumbnail?: { image: string; video?: string };
  aspect: "component" | "page";
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref);
  const debouncedInView = useDebounce(isInView, 1500);
  // const [isPlaying, setIsPlaying] = React.useState(false);
  // const handleMouseEnter = () => {
  //   setIsPlaying(true);
  // };
  // const handleMouseLeave = () => {
  //   setIsPlaying(false);
  // };
  if (!thumbnail)
    return (
      <div className="flex aspect-video w-full items-center justify-center">
        No thumbnail
      </div>
    );

  if (thumbnail?.video) {
    return (
      <div ref={ref}>
        {debouncedInView && isInView ? (
          <div className="aspect-video w-full bg-card">
            <video
              src={thumbnail.video}
              poster={thumbnail.image}
              muted
              loop
              autoPlay
              preload="none"
              className="aspect-video object-cover opacity-90 duration-150 group-hover:opacity-100"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-card">
            <img
              src={thumbnail.image}
              alt="Thumbnail"
              className="aspect-video object-cover opacity-90 duration-150 group-hover:opacity-100"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-card">
      <img
        src={thumbnail.image}
        alt="Thumbnail"
        className="aspect-video object-cover opacity-90 duration-150 group-hover:opacity-100"
      />
    </div>
  );

  // return (
  //   <div className="flex items-center justify-center rounded-sm border border-border/20 bg-background duration-150 group-hover:border-border/50">
  //     {thumbnail?.video ? (
  //       <video
  //         src={thumbnail.video}
  //         muted
  //         // loop
  //         // autoPlay
  //         preload="none"
  //         className="opacity-90 duration-150 group-hover:opacity-100"
  //       />
  //     ) : thumbnail?.image && aspect === "page" ? (
  //       <ScrollArea
  //         className={cn({
  //           "aspect-video": aspect === "component",
  //           "aspect-[9/11]": aspect === "templates" || type === "blocks",
  //         })}
  //       >
  //         <img
  //           src={thumbnail.image}
  //           alt={title}
  //           className="aspect-video w-full object-cover opacity-90 duration-150 group-hover:opacity-100"
  //         />
  //       </ScrollArea>
  //     ) : (
  //       <div className="flex aspect-video w-full items-center justify-center bg-card/50">
  //         <p className="text-muted-foreground">No thumbnail</p>
  //       </div>
  //     )}
  //   </div>
  // );
};
