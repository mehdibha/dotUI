import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { Mdx } from "@/components/mdx/mdx-remote";
import { TableOfContents } from "@/components/toc";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/classes";
import { getDocFromSlug, getAllDocs } from "@/utils/docs";
import { DataGrid } from "./data-grid";

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = await getDocFromSlug(params.slug);

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
  const doc = await getDocFromSlug(params.slug);

  if (!doc) {
    notFound();
  }

  const { rawContent, metadata, categories, items } = doc;

  return (
    <main
      className={cn("relative pb-20 lg:gap-10", {
        "xl:grid xl:grid-cols-[1fr_220px]": !!doc.toc.items, // !!doc.toc
      })}
    >
      <div className="mx-auto w-full min-w-0 pt-6">
        {metadata.breadcrumbs.length > 1 && (
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              {metadata.breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  {index === metadata.breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                  {index < metadata.breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator>
                      <ChevronRightIcon />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="text-4xl font-bold">{metadata.title}</h1>
        <p className="mt-2 text-muted-foreground">{metadata.description}</p>
        {categories && categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {categories.map((category, index) => (
              <Button key={index} size="sm" variant="secondary" asChild>
                <Link href={category.href}>{category.label}</Link>
              </Button>
            ))}
          </div>
        )}
        <div className="mt-10 text-sm md:text-base">
          <Mdx source={rawContent} />
          {items && items.length > 0 && <DataGrid items={items} type={metadata.type} />}
        </div>
      </div>
      {doc.toc.items && ( // doc.toc
        <div className="hidden text-sm xl:block">
          <div className="sticky top-0">
            <ScrollArea className="h-screen pb-8">
              <div className="pb-16 pt-6">
                <TableOfContents toc={doc.toc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  );
}
