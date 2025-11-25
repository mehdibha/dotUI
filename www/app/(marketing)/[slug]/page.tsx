import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { AlignLeftIcon, ExternalLinkIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { LinkButton } from "@dotui/registry/ui/button";

import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import { PageLastUpdate } from "@/modules/docs/last-update";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { marketingSource } from "@/modules/docs/source";
import { TOCItems, TOCProvider, TOCScrollArea } from "@/modules/docs/toc";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/[slug]">) {
  const page = marketingSource.getPage([(await params).slug]);
  if (!page) notFound();

  const { body: MDXContent, toc, lastModified } = await page.data.load();

  const hasToc = toc && toc.length > 0;

  return (
    <div
      className={cn(
        "container w-full max-w-3xl xl:max-w-4xl",
        hasToc &&
          "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]",
      )}
    >
      <div className="pt-4 pb-24 md:pt-10 lg:pt-16">
        <h1 className="font-semibold text-2xl lg:text-3xl">
          {page.data.title}
        </h1>
        <p className="mt-2 text-fg-muted">{page.data.description}</p>
        {page.data.links && page.data.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {page.data.links.map((link, index) => (
              <LinkButton
                key={index}
                href={link.href as Route}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="h-6 font-semibold text-xs [&_svg]:size-3"
              >
                {link.label}
                <ExternalLinkIcon />
              </LinkButton>
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
      <TOCProvider toc={toc}>
        {hasToc && (
          <div className="sticky top-10 flex h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden">
            <h3 className="inline-flex items-center gap-1.5 text-fg-muted text-sm">
              <AlignLeftIcon className="size-4 text-fg-muted" />
              On this page
            </h3>
            <TOCScrollArea>
              <TOCItems />
            </TOCScrollArea>
          </div>
        )}
      </TOCProvider>
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
