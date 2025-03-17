import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type TableOfContents as TocType } from "fumadocs-core/server";
import { ExternalLinkIcon } from "lucide-react";
import { truncateOnWord } from "@/lib/string";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { DocsPager } from "@/components/docs/docs-pager";
import { PageLastUpdate } from "@/components/docs/last-update";
import { mdxComponents } from "@/components/docs/mdx-components";
import { TableOfContents } from "@/components/docs/toc";
import { GitHubIcon } from "@/components/icons";
import { AdobeIcon } from "@/components/icons/adobe-icon";
import { source } from "@/app/source";
import { siteConfig } from "@/config";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  const MDXContent = page.data.body;

  return (
    <div
      className={cn(
        "container w-full max-w-3xl xl:max-w-4xl",
        page.data.toc &&
          page.data.toc.length > 0 &&
          "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]"
      )}
    >
      <div className="pb-24 pt-4 sm:pt-10 lg:pt-20">
        <Breadcrumbs tree={source.pageTree} className="mb-2" />
        <h1 className="text-3xl font-bold lg:text-4xl">{page.data.title}</h1>
        <p className="text-fg-muted mt-2">{page.data.description}</p>
        {page.data.links && page.data.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {page.data.links.map((link, index) => (
              <Button
                key={index}
                href={link.href}
                prefix={getIcon(link.href)}
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
          <MDXContent components={mdxComponents} />
        </div>
        <div className="mt-20 space-y-4">
          <PageLastUpdate path={page.file.path} />
          <DocsPager currentPathname={page.url} />
        </div>
      </div>
      {page.data.toc && page.data.toc.length > 0 && (
        <div className="pt-20">
          <div className="sticky top-10 h-[calc(100svh-calc(var(--spacing)*10))]">
            <TableOfContents toc={page.data.toc as TocType} />
          </div>
        </div>
      )}
    </div>
  );
}

const getIcon = (url: string) => {
  if (url.includes("adobe")) return <AdobeIcon />;
  if (url.includes("github")) return <GitHubIcon />;
  return null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const page = source.getPage((await params).slug);
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
      images: [siteConfig.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description
        ? truncateOnWord(page.data.description, 148, true)
        : undefined,
      images: [siteConfig.thumbnail],
      creator: siteConfig.twitter.creator,
    },
  };
}

export function generateStaticParams() {
  return source.generateParams();
}
