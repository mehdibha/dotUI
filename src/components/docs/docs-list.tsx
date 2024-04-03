import Link from "next/link";
import { getDocTypeFromSlug } from "@/utils/docs";
import { Button } from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";
import { getDocs } from "@/server/docs";
import { DocCard } from "./doc-card";

export interface DocsListProps {
  name: string;
  limit?: number;
  className?: string;
}

export const DocsList = ({ name, limit, className }: DocsListProps) => {
  const docs = getDocs(name);

  const type = getDocTypeFromSlug(name);
  const hasMore = limit ? docs.length > limit : false;

  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-4",
        {
          "grid-cols-3": type === "component" || type === "hook",
          "grid-cols-4": type === "block" || type === "template",
        },
        className
      )}
    >
      {docs.slice(0, limit).map((doc, index) => (
        <DocCard key={index} doc={doc} />
      ))}
      {hasMore && (
        <Link
          href={`/${name}`}
          className="flex cursor-pointer items-center justify-center rounded-md border border-border/20 bg-card/70 transition-colors duration-150 hover:border-border hover:bg-card"
        >
          Explore more
        </Link>
      )}
    </div>
  );
};
