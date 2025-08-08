"use client";

import { Button } from "@dotui/ui/components/button";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/components/page-layout";
import { BlocksNav } from "@/modules/blocks/blocks-nav";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderHeading>Blocks that don’t lock you in.</PageHeaderHeading>
        <PageHeaderDescription>
          Modern UI blocks available in infinite styles.
        </PageHeaderDescription>
        <PageActions>
          {/* <ActiveStyleSelector buttonProps={{ className: "px-4" }} /> */}
        </PageActions>
      </PageHeader>
      <BlocksNav className="mt-8">{children}</BlocksNav>
    </PageLayout>
  );
}
