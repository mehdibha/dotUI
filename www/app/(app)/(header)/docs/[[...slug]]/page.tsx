import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlignLeftIcon,
  ChevronDownIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
} from "lucide-react";

import { AdobeIcon } from "@dotui/registry/components/icons/adobe";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

import { siteConfig } from "@/config";
import { truncateOnWord } from "@/lib/string";
import { DocsPager } from "@/modules/docs/components/docs-pager";
import { PageLastUpdate } from "@/modules/docs/components/last-update";
import { mdxComponents } from "@/modules/docs/components/mdx-components";
import { TableOfContents } from "@/modules/docs/components/toc";
import { docsSource } from "@/modules/docs/lib/source";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/docs/[[...slug]]">) {
  const page = docsSource.getPage((await params).slug);
  if (!page) notFound();

  const { body: MDXContent, toc, lastModified } = await page.data.load();

  return (
    <div className="container w-full max-w-3xl xl:max-w-5xl py-6 md:py-10 lg:min-h-screen lg:py-10">
      <div className="flex items-stretch justify-between gap-10">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold lg:text-4xl">{page.data.title}</h1>
          <p className="mt-2 text-fg-muted">{page.data.description}</p>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex items-center gap-2">
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
          {page.data.links && page.data.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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
      </div>
      <Tabs className="mt-4">
        <TabList
          className={cn(
            "*:py-3 *:px-4 *:not-selected:text-fg-muted *:not-selected:hover:text-fg *:duration-100",
            "*:transition-colors w-400 -ml-80 *:translate-x-80 sticky top-12 z-5 bg-bg",
          )}
        >
          <Tab id="overview">Overview</Tab>
          <Tab id="examples">Examples</Tab>
          <Tab id="docs">Docs</Tab>
        </TabList>
        <TabPanel id="overview">
          <div
            className={cn(
              // "container w-full max-w-3xl xl:max-w-4xl",
              toc &&
                toc.length > 0 &&
                "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(160px,180px)]",
            )}
          >
            <div className="flex min-h-[calc(100svh-(var(--spacing)*14))] flex-col">
              <div className="mt-10 flex-1 text-sm md:text-base">
                <MDXContent components={mdxComponents} />
              </div>
              <div className="mt-20 space-y-4">
                {lastModified && <PageLastUpdate date={lastModified} />}
                <DocsPager currentPathname={page.url} />
              </div>
            </div>
            {toc && toc.length > 0 && (
              <div className="pt-10 max-xl:hidden">
                <div className="sticky top-30 h-[calc(100svh-calc(var(--spacing)*10))]">
                  <div className="mb-3 -ml-1.5 flex items-center gap-2">
                    <AlignLeftIcon className="size-4 text-fg-muted" />
                    <p className="text-sm text-fg-muted">On this page</p>
                  </div>
                  <TableOfContents toc={toc} />
                </div>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel id="examples"></TabPanel>
        <TabPanel id="docs"></TabPanel>
      </Tabs>
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
