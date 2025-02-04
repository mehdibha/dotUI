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

const config = siteConfig.global;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  const MDXContent = page.data.body;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(50px,1fr)_minmax(0,1100px)_minmax(50px,1fr)] xl:gap-10">
      <div className="border-x-(--pattern-fg) h-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]" />
      <div className="container max-w-6xl pt-20">
        <div className="before:bg-border grid grid-cols-[1fr_200px] gap-10 before:absolute before:top-0 before:h-px before:w-[200vw] before:-translate-x-1/2 before:content-['']">
          <div className="pt-4">
            <Breadcrumbs tree={source.pageTree} className="mb-2" />
            <h1 className="text-4xl font-bold">{page.data.title}</h1>
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
            <div className="mt-20 pb-20 space-y-4">
              <PageLastUpdate path={page.file.path} />
              <DocsPager currentPathname={page.url} />
            </div>
          </div>
          {page.data.toc && page.data.toc.length > 0 && (
            <div className="bg-bg z-10 hidden pt-4 text-sm xl:block">
              <div className="sticky top-8 h-[calc(100svh-calc(var(--spacing)*8))]">
                <TableOfContents toc={page.data.toc as TocType} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-x-(--pattern-fg) h-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]" />
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

export function generateStaticParams() {
  return source.generateParams();
}
