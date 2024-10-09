import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type TableOfContents as TocType } from "fumadocs-core/server";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import { truncateOnWord } from "@/lib/string";
import { DocsPager } from "@/components/docs-pager";
import { AdobeIcon } from "@/components/icons/adobe";
import { PageLastUpdate } from "@/components/last-update";
import { mdxComponents } from "@/components/mdx-components";
import { TableOfContents } from "@/components/toc";
import { Button } from "@/registry/ui/default/core/button";
import { cn } from "@/registry/ui/default/lib/cn";
import { getPage, pageTree, generateParams } from "@/app/source";
import { siteConfig } from "@/config";

interface PageProps {
  params: {
    slug: string[];
  };
}

const config = siteConfig.global;

export default async function Page({ params }: PageProps) {
  const page = getPage(params.slug);

  if (!page) notFound();

  const MDXContent = page.data.body;
  const breadcrumbs = page.data._file.path
    .split("/")
    .map((item) =>
      item.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    );

  return (
    <div
      className={cn("relative py-20", {
        "lg:grid lg:grid-cols-[1fr_230px] lg:gap-10":
          page.data.toc && page.data.toc.length > 0,
      })}
    >
      <div className="container max-w-3xl">
        {breadcrumbs.length > 1 && (
          <div className="text-fg-muted mb-2 flex items-center gap-1 text-sm [&_svg]:size-4">
            {breadcrumbs.map((item, index) => (
              <>
                <span key={index}>{item}</span>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRightIcon className="" />
                )}
              </>
            ))}
          </div>
        )}
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
        <div className="mt-20 space-y-4">
          <PageLastUpdate path={page.file.path} />
          <DocsPager currentPathname={page.url} />
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

const getIcon = (url: string) => {
  if (url.includes("adobe")) return <AdobeIcon />;
  return null;
};

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getPage(params.slug);
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
  return generateParams();
}
