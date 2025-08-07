import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@dotui/ui/components/button";
import { cn } from "@dotui/ui/lib/utils";

import { AdobeIcon, GitHubIcon } from "@/components/icons";
import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { Breadcrumbs } from "@/modules/docs/components/breadcrumbs";
import { DocsPager } from "@/modules/docs/components/docs-pager";
import { PageLastUpdate } from "@/modules/docs/components/last-update";
import { mdxComponents } from "@/modules/docs/components/mdx-components";
import { TableOfContents } from "@/modules/docs/components/toc";
import { source } from "@/modules/docs/lib/source";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();

  const { body: MDXContent, toc } = await page.data.load();
  // const MDXContent = page.data.body;

  return (
    <div
      className={cn(
        "container w-full max-w-3xl xl:max-w-4xl",
        toc &&
          toc.length > 0 &&
          "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]",
      )}
    >
      <div className="pt-4 pb-24 md:pt-10 lg:pt-20">
        {/* <Breadcrumbs tree={source.pageTree} className="mb-2" /> */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold lg:text-4xl">{page.data.title}</h1>
          <DocsPager variant="tooltip" currentPathname={page.url} />
        </div>
        <p className="mt-2 text-fg-muted">{page.data.description}</p>
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
          {/* <PageLastUpdate path={page.path} /> */}
          <DocsPager currentPathname={page.url} />
        </div>
      </div>
      {toc && toc.length > 0 && (
        <div className="pt-20 max-xl:hidden">
          <div className="sticky top-10 h-[calc(100svh-calc(var(--spacing)*10))]">
            <TableOfContents toc={toc} />
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
