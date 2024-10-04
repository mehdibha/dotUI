import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { DocsPager } from "@/components/docs-pager";
import { TableOfContents } from "@/components/toc";
import { Mdx } from "@/components/mdx/mdx-remote";
import {
  Breadcrumbs,
  Breadcrumb,
} from "@/registry/ui/default/core/breadcrumbs";
import { Button } from "@/registry/ui/default/core/button";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { cn } from "@/registry/ui/default/lib/cn";
import { getDocFromSlug, getDocs } from "@/server/docs";

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

  const hasToc = !!doc.toc.items && doc.toc.items.length > 0;
  const { rawContent, metadata, categories } = doc;

  return (
    <main
      className={cn("relative py-20", {
        "xl:grid xl:grid-cols-[1fr_230px] xl:gap-10": hasToc,
      })}
      // className="relative py-20"
    >
      <div className="container max-w-3xl">
        {metadata.breadcrumbs.length > 1 && (
          <Breadcrumbs className="mb-2">
            {metadata.breadcrumbs.map((item, index) => (
              <Breadcrumb
                key={item.href}
                href={
                  index < metadata.breadcrumbs.length - 1
                    ? item.href
                    : undefined
                }
              >
                {item.label}
              </Breadcrumb>
            ))}
          </Breadcrumbs>
        )}
        <h1 className="text-4xl font-bold">{metadata.title}</h1>
        <p className="mt-2 text-fg-muted">{metadata.description}</p>
        {metadata.links && metadata.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {metadata.links.map((link, index) => (
              <Button
                key={index}
                href={link.href}
                suffix={<ExternalLinkIcon />}
                size="sm"
                className="[&_svg]:size-3 h-6 text-xs font-semibold"
                target="_blank"
              >
                {link.label}
              </Button>
            ))}
          </div>
        )}
        {categories && categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                size="sm"
                href={category.href}
                className="h-7"
              >
                {category.label}
              </Button>
            ))}
          </div>
        )}
        <div className="mt-10 text-sm md:text-base">
          <Mdx source={rawContent} />
        </div>
        <div className="mt-20">
          <DocsPager />
        </div>
      </div>
      {hasToc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-0 pt-8">
            <TableOfContents toc={doc.toc} />
          </div>
        </div>
      )}
    </main>
  );
}
