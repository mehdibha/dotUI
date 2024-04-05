"use client";

import React from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { getAspectFromType } from "@/utils/docs";
import { Badge } from "@/lib/components/core/default/badge";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/core/default/tooltip";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils/classes";
import { truncateOnWord } from "@/lib/utils/string";
import type { DocMetadata } from "@/types/docs";

export const DocCard = ({ doc, className }: { doc: DocMetadata; className?: string }) => {
  return (
    <Link
      href={doc.href}
      target={doc.href.startsWith("/") ? undefined : "_blank"}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-md border border-border/20 bg-card/70 transition-colors duration-150 hover:border-border hover:bg-card",
        className
      )}
    >
      {doc.type !== "hook" && (
        <Thumbnail
          thumbnail={doc.thumbnail}
          title={doc.title}
          aspect={getAspectFromType(doc.type)}
        />
      )}
      <div className={cn("flex flex-1 flex-col p-4", {})}>
        <div className="flex-1">
          <p className="text-lg font-semibold">{doc.title}</p>
          {doc.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {truncateOnWord(doc.description, 70)}
            </p>
          )}
        </div>
        {doc.keywords && (
          <div className="mt-3 flex flex-wrap gap-1">
            {doc.keywords
              .slice(0, doc.keywords.length > 3 ? 2 : 3)
              .map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
              ))}
            {doc.keywords.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-muted-foreground">
                    +{doc.keywords.length - 2} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="pl-6">
                  <ul className="list-disc">
                    {doc.keywords.slice(2).map((keyword, index) => (
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
  );
};

const Thumbnail = ({
  title,
  thumbnail,
  aspect,
}: {
  title: string;
  thumbnail?: { image: string; video?: string };
  aspect: "video" | "page";
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref);
  const debouncedInView = useDebounce(isInView, 1500);

  if (!thumbnail) return <div className="aspect-video w-full" />;

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
              playsInline
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

  if (aspect === "page") {
    return (
      <ScrollArea className="aspect-[9/11]">
        <img
          src={thumbnail.image}
          alt={title}
          className="opacity-90 duration-150 group-hover:opacity-100"
        />
      </ScrollArea>
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
};
