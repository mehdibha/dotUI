import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { TableOfContents } from "@/components/docs/toc";
import { Mdx } from "@/components/mdx/mdx-remote";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/lib/components/core/default/breadcrumb";
import { Button } from "@/lib/components/core/default/button";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";
import { cn } from "@/lib/utils/classes";
import { getDocFromSlug, getDocs } from "@/server/docs";

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
  const allDocs = getDocs(undefined, true);
  return allDocs.map((doc) => ({ slug: doc.href.split("/").slice(1) }));
}

export default async function Page({ params }: PageProps) {
  const doc = await getDocFromSlug(params.slug);

  if (!doc) {
    notFound();
  }

  const { rawContent, metadata, categories } = doc;

  return (
    <main
      className={cn("relative pb-20 lg:gap-10", {
        "xl:grid xl:grid-cols-[1fr_220px]": !!doc.toc.items, // !!doc.toc
      })}
    >
      <div className="mx-auto w-full min-w-0 pt-6">
        {metadata.breadcrumbs.length > 1 && (
          <Breadcrumb className="mb-2">
            <BreadcrumbList className="sm:gap-1.5">
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
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Button key={index} size="sm" asChild className="h-7">
                <Link href={category.href}>{category.label}</Link>
              </Button>
            ))}
          </div>
        )}
        <div className="mt-10 text-sm md:text-base">
          <Mdx source={rawContent} />
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
