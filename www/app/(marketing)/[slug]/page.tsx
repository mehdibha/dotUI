import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";

import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { PageLastUpdate } from "@/modules/docs/components/last-update";
import { mdxComponents } from "@/modules/docs/components/mdx-components";
import { TableOfContents } from "@/modules/docs/components/toc";
import { marketingSource } from "@/modules/docs/lib/source";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/[slug]">) {
  const page = marketingSource.getPage([(await params).slug]);
  if (!page) notFound();

  const { body: MDXContent, toc, lastModified } = await page.data.load();

  return (
    <div
      className={cn(
        "container w-full max-w-3xl xl:max-w-4xl",
        toc &&
          toc.length > 0 &&
          "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]",
      )}
    >
      <div className="pt-4 pb-24 md:pt-10 lg:pt-16">
        <h1 className="text-2xl font-semibold lg:text-3xl">
          {page.data.title}
        </h1>
        <p className="mt-2 text-fg-muted">{page.data.description}</p>
        {page.data.links && page.data.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {page.data.links.map((link, index) => (
              <Button
                key={index}
                asChild
                size="sm"
                className="h-6 text-xs font-semibold [&_svg]:size-3"
              >
                <a href={link.href as string} target="_blank">
                  {link.label}
                  <ExternalLinkIcon />
                </a>
              </Button>
            ))}
          </div>
        )}
        <div className="mt-10 text-sm md:text-base">
          <MDXContent components={mdxComponents} />
        </div>
        <div className="mt-20 space-y-4">
          {lastModified && <PageLastUpdate date={lastModified} />}
        </div>
      </div>
      {toc && toc.length > 0 && (
        <div className="pt-16 max-xl:hidden">
          <div className="sticky top-20 h-[calc(100svh-calc(var(--spacing)*20))]">
            <TableOfContents toc={toc} />
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const page = marketingSource.getPage([(await params).slug]);
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
  const params = marketingSource.generateParams();
  return params.map((param) => ({
    slug: Array.isArray(param.slug) ? param.slug[0] : param.slug,
  }));
}
