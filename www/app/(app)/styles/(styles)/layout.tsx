import type { Metadata } from "next";

import { Button } from "@dotui/ui/components/button";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/components/page-layout";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { StylesPageNav } from "./styles-page-nav";

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

export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <CreateStyleModal>
            <Button variant="primary">Create your style</Button>
          </CreateStyleModal>
          <Button variant="default" href="/docs/styles">
            Documentation
          </Button>
        </PageActions>
      </PageHeader>
      <StylesPageNav className="mt-8">{children}</StylesPageNav>
    </PageLayout>
  );
}
