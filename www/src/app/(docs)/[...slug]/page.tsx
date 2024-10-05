import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { DocsPager } from "@/components/docs-pager";
import { TableOfContents } from "@/components/toc";
import { Button } from "@/registry/ui/default/core/button";
import { cn } from "@/registry/ui/default/lib/cn";
import { allDocs, getDocBySlug } from "@/lib/docs";
import { MDXContent } from "@content-collections/mdx/react";
import { components } from "@/components/mdx-components";
import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { getTableOfContents } from "fumadocs-core/server";

interface PageProps {
  params: {
    slug: string[];
  };
}

const config = siteConfig.global;

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getDocBySlug(params.slug);

  if (!doc) {
    return {};
  }

  const metadata: Metadata = {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description
        ? truncateOnWord(doc.description, 148, true)
        : undefined,
      type: "article",
      url: `${config.url}${doc._meta.path}`,
      images: [config.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description
        ? truncateOnWord(doc.description, 148, true)
        : undefined,
      images: [config.thumbnail],
      creator: config.twitter.creator,
    },
  };

  return metadata;
}

export function generateStaticParams(): PageProps["params"][] {
  return allDocs.map((doc) => ({ slug: doc._meta.path.split("/") }));
}

export default async function Page({ params }: PageProps) {
  const doc = getDocBySlug(params.slug);

  if (!doc) {
    notFound();
  }

  const toc = await getTableOfContents(doc.rawContent);
  const hasToc = toc.length > 0;

  return (
    <div
      className={cn("relative py-20", {
        "lg:grid lg:grid-cols-[1fr_230px] lg:gap-10": hasToc,
      })}
    >
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold">{doc.title}</h1>
        <p className="mt-2 text-fg-muted">{doc.description}</p>
        {doc.links && doc.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {doc.links.map((link, index) => (
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
        <div className="mt-10 text-sm md:text-base">
          <MDXContent code={doc.content} components={components} />
        </div>
        <div className="mt-20">
          <DocsPager currentPagePath={`/${doc._meta.path}`} />
        </div>
      </div>
      {hasToc && (
        <div className="hidden text-sm lg:block">
          <div className="sticky top-0 pt-8">
            <TableOfContents toc={toc} />
          </div>
        </div>
      )}
    </div>
  );
}
