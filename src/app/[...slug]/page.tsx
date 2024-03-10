import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx-remote";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/classes";
import { type Item, getDocFromSlug, getAllDocs } from "@/lib/docs";

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
      {metadata.breadcrumbs.length > 0 && (
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
        {items && <DataGrid items={items} type={metadata.type} />}
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
            href={item.href}
            className="cursor-pointer rounded-md bg-card p-2 transition-colors duration-100 hover:bg-card/70"
          >
            {type !== "hooks" && (
              <div
                className={cn("rounded-sm bg-background", {
                  "aspect-video": type === "components",
                  "aspect-[9/11]": type === "templates" || type === "pages",
                  "aspect-square": type === "icons",
                })}
              ></div>
            )}
            <div className="p-3">
              <p className="mt- text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
