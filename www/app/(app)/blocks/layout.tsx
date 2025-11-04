import type { Metadata } from "next";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/components/layout/page-layout";
import { BlocksNav } from "@/modules/blocks/blocks-nav";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";

const title = "Blocks that don’t lock you in.";
const description = "Modern UI blocks available in infinite styles.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function BlocksLayout({ children }: LayoutProps<"/blocks">) {
  return (
    <PageLayout>
      <div className="relative">
        <Header
          items={docsSource.pageTree.children}
          visibleItems={["menu", "search", "github"]}
          className="max-md:hidden h-12"
        />
        <PageHeader>
          <PageHeaderHeading>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
            <ActiveStyleSelector buttonProps={{ className: "px-4" }} />
          </PageActions>
        </PageHeader>
      </div>
      <BlocksNav>{children}</BlocksNav>
    </PageLayout>
  );
}
