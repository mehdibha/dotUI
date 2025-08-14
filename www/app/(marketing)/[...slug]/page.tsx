import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { AdobeIcon, GitHubIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";

import { DocsPager } from "@/modules/docs/components/docs-pager";
import { PageLastUpdate } from "@/modules/docs/components/last-update";
import { mdxComponents } from "@/modules/docs/components/mdx-components";
import { TableOfContents } from "@/modules/docs/components/toc";
import { marketingSource } from "@/modules/docs/lib/source";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = marketingSource.getPage((await params).slug);
  if (!page) notFound();

  // const { body: MDXContent, toc } = await page.data.load();

  return (
    <div
      className={cn(
        "container w-full max-w-3xl xl:max-w-4xl",
        // toc &&
        //   toc.length > 0 &&
        //   "grid grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)]",
      )}
    >
      <div className="pb-24 pt-4 md:pt-10 lg:pt-20">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold lg:text-4xl">{page.data.title}</h1>
        </div>
      </div>
    </div>
  );
}
