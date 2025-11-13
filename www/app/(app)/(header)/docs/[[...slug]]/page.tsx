import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { AdobeIcon } from "@dotui/registry/components/icons/adobe";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";

import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { DocsPager } from "@/modules/docs/components/docs-pager";
import { PageLastUpdate } from "@/modules/docs/components/last-update";
import { mdxComponents } from "@/modules/docs/components/mdx-components";
import { TableOfContents, TocProvider } from "@/modules/docs/components/toc";
import { docsSource } from "@/modules/docs/lib/source";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/docs/[[...slug]]">) {
  const page = docsSource.getPage((await params).slug);
  if (!page) notFound();

  const { body: MDXContent, toc, lastModified } = await page.data.load();

  const hasToc = toc && toc.length > 0;

  return (
    <div className="py-6 md:py-10 lg:py-10">
      <div className="container max-w-3xl xl:max-w-5xl flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 sm:gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-3xl font-bold lg:text-4xl truncate">
              {page.data.title}
            </h1>
            <div className="flex items-center gap-2 sm:hidden">
              <Group>
                <Button size="sm">
                  <CopyIcon /> Copy page
                </Button>
                <Button size="sm">
                  <ChevronDownIcon />
                </Button>
              </Group>
              <DocsPager currentPathname={page.url} />
            </div>
          </div>
          <p className="text-fg-muted">{page.data.description}</p>
          {page.data.links && page.data.links.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {page.data.links.map((link, index) => {
                const icon = getIcon(link.href);
                return (
                  <Button
                    key={index}
                    asChild
                    size="sm"
                    className="h-6 text-xs font-semibold [&_svg]:size-3"
                  >
                    <Link href={link.href as Route} target="_blank">
                      {icon}
                      {link.label}
                      <ExternalLinkIcon />
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-4 max-sm:contents">
          <div className="flex items-center gap-2 max-sm:hidden">
            <Group>
              <Button size="sm">
                <CopyIcon /> Copy page
              </Button>
              <Button size="sm">
                <ChevronDownIcon />
              </Button>
            </Group>
            <DocsPager currentPathname={page.url} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "not-has-data-page-tabs:mt-20 has-data-page-tabs:**:data-outer-toc:hidden",
          "not-has-data-page-tabs:container not-has-data-page-tabs:max-w-3xl not-has-data-page-tabs:xl:max-w-5xl",
          hasToc &&
            "not-has-data-page-tabs:grid not-has-data-page-tabs:grid-cols-[1fr_180px] not-has-data-page-tabs:gap-10",
        )}
      >
        <TocProvider toc={toc}>
          <div>
            <MDXContent components={mdxComponents} />
          </div>
        </TocProvider>
        {hasToc && (
          <div>
            <TableOfContents
              toc={toc}
              data-outer-toc
              className="sticky top-22 **:data-scroll-area-viewport:h-[calc(100svh-calc(var(--spacing)*20))]"
            />
          </div>
        )}
      </div>

      {lastModified && (
        <div className="container max-w-3xl xl:max-w-5xl">
          <PageLastUpdate date={lastModified} />
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
}: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const page = docsSource.getPage((await params).slug);
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
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            page.data.title,
          )}${page.data.description ? `&description=${encodeURIComponent(page.data.description)}` : ""}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description
        ? truncateOnWord(page.data.description, 148, true)
        : undefined,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            page.data.title,
          )}${page.data.description ? `&description=${encodeURIComponent(page.data.description)}` : ""}`,
        },
      ],
      creator: siteConfig.twitter.creator,
    },
  };
}

export function generateStaticParams() {
  const params = docsSource.generateParams();
  return params.map((param) => ({
    slug: Array.isArray(param.slug) ? param.slug : [param.slug],
  }));
}
