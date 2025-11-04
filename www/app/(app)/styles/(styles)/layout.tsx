import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@dotui/registry/ui/button";

import { Header } from "@/components/layout/header";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/components/layout/page-layout";
import { docsSource } from "@/modules/docs/lib/source";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { StylesPageNav } from "@/modules/styles/components/styles-page-nav";

const title = "Find your style or make your own.";
const description = "Try our hand-picked styles or create yours from scratch.";

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

export default function StylesLayout({ children }: LayoutProps<"/styles">) {
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
            <CreateStyleModal>
              <Button variant="primary">Create your style</Button>
            </CreateStyleModal>
            <Button variant="default" asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
          </PageActions>
        </PageHeader>
      </div>
      <StylesPageNav>{children}</StylesPageNav>
    </PageLayout>
  );
}
