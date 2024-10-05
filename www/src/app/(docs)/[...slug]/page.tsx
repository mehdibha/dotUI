import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/app/source";
import { DocsPager } from "@/components/docs-pager";
import { components } from "@/components/mdx-components";
import { TableOfContents } from "@/components/toc";
import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { Button } from "@/registry/ui/default/core/button";
import { cn } from "@/registry/ui/default/lib/cn";
import { MDXContent } from "@content-collections/mdx/react";
import { type TableOfContents as TocType } from "fumadocs-core/server";
import { ExternalLinkIcon } from "lucide-react";

interface PageProps {
  params: {
    slug: string[];
  };
}

const config = siteConfig.global;

export default async function Page({ params }: PageProps) {
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return (
    <div
      className={cn("relative py-20", {
        "lg:grid lg:grid-cols-[1fr_230px] lg:gap-10":
          page.data.toc && page.data.toc.length > 0,
      })}
    >
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold">{page.data.title}</h1>
        <p className="text-fg-muted mt-2">{page.data.description}</p>
        {page.data.links && page.data.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {page.data.links.map((link, index) => (
              <Button
                key={index}
                href={link.href}
                suffix={<ExternalLinkIcon />}
                size="sm"
                className="h-6 text-xs font-semibold [&_svg]:size-3"
                target="_blank"
              >
                {link.label}
              </Button>
            ))}
          </div>
        )}
        <div className="mt-10 text-sm md:text-base">
          <MDXContent code={page.data.body} components={components} />
        </div>
        <div className="mt-20">
          <DocsPager currentPagePath={`/${page.data._meta.path}`} />
        </div>
      </div>
      {page.data.toc && page.data.toc.length > 0 && (
        <div className="hidden text-sm lg:block">
          <div className="sticky top-0 pt-8">
            <TableOfContents toc={page.data.toc as TocType} />
          </div>
        </div>
      )}
    </div>
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description
        ? truncateOnWord(page.data.description, 148, true)
        : undefined,
      type: "article",
      url: page.url,
      images: [config.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description
        ? truncateOnWord(page.data.description, 148, true)
        : undefined,
      images: [config.thumbnail],
      creator: config.twitter.creator,
    },
  };
}

export function generateStaticParams(): PageProps["params"][] {
  return source.generateParams();
}
