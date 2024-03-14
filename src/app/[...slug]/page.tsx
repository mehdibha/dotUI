import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx-remote";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/classes";
import { truncateOnWord } from "@/utils/text";
import { type Item, getDocFromSlug, getAllDocs } from "@/lib/docs";
import { IconsList } from "@/components/icons-list";

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = getDocFromSlug(params.slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
    // TODO add openGraph and twitter
  };
}
export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const allDocs = getAllDocs();

  return allDocs.map((doc) => ({ slug: doc.href.split("/").slice(1) }));
}

export default async function Page({ params }: PageProps) {
  const doc = getDocFromSlug(params.slug);

  if (!doc) {
    notFound();
  }

  const { rawContent, metadata, categories, items } = doc;

  return (
    <main>
      {/* breadcrumbs  */}
      {metadata.breadcrumbs.length > 1 && (
        <p className="flex items-center text-muted-foreground">
          {metadata.breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <Link
                href={breadcrumb.href}
                className={cn("hover:underline", {
                  "font-semibold text-foreground":
                    index === metadata.breadcrumbs.length - 1,
                })}
              >
                {breadcrumb.label}
              </Link>
              {index < metadata.breadcrumbs.length - 1 && <ChevronRightIcon />}
            </React.Fragment>
          ))}
        </p>
      )}
      <h1 className="mt-2 text-4xl font-bold">{metadata.title}</h1>
      <p className="mt-2 text-muted-foreground">{metadata.description}</p>
      {categories && categories.length > 0 && (
        <div className="mt-6">
          <div className="flex gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="focus-ring flex cursor-pointer items-center justify-center rounded bg-secondary px-4 py-1 duration-150 hover:bg-secondary/50"
              >
                <p>{category.label}</p>
              </Link>
            ))}
          </div>
          {categories.length > 7 && (
            <div className="flex justify-end">
              <Link href="#" className="inline-flex items-center hover:underline">
                <ArrowRightIcon size={18} className="mr-2" />
                See all categories
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="mt-10">
        <Mdx source={rawContent} />
        {items && items.length > 0 && <DataGrid items={items} type={metadata.type} />}
      </div>
    </main>
  );
}

const DataGrid = ({ type, items }: { type: string; items: Item[] }) => {
  return (
    <div className="mt-6">
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
          "grid-cols-4": type === "templates" || type === "pages",
          "grid-cols-8": type === "icons",
        })}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.metadata.externalLink ?? item.href}
            target={item.metadata.externalLink ? "_blank" : undefined}
            className="group flex cursor-pointer flex-col rounded-md border border-border/20 bg-card/70 p-2 transition-colors duration-150 hover:border-border hover:bg-card"
          >
            {type !== "hooks" && (
              <ScrollArea
                className={cn(
                  "flex items-center justify-center rounded-sm border border-border/20 bg-background duration-150 group-hover:border-border/50",
                  {
                    "aspect-video": type === "components",
                    "aspect-[9/11]": type === "templates" || type === "pages",
                    "aspect-square": type === "icons",
                  }
                )}
              >
                {item.metadata.thumbnail ? (
                  item.metadata.thumbnail.includes("mp4") ? (
                    <video
                      src={item.metadata.thumbnail}
                      muted
                      loop
                      autoPlay
                      className="opacity-90 duration-150 group-hover:opacity-100"
                    />
                  ) : (
                    <img
                      src={item.metadata.thumbnail}
                      alt={item.metadata.title}
                      className="opacity-90 duration-150 group-hover:opacity-100"
                    />
                  )
                ) : (
                  <p className="text-muted-foreground">No thumbnail</p>
                )}
              </ScrollArea>
            )}
            <div
              className={cn("flex flex-1 flex-col px-2 pb-1 pt-3", {
                "pt-1": type === "hooks",
                "pb-3": !item.metadata.keywords,
              })}
            >
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
