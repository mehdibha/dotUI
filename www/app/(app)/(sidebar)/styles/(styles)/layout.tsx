import { Button } from "@dotui/ui/components/button";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageLayout,
} from "@/components/page-layout";
import { PageNav } from "@/components/page-nav";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { StylesPageNav } from "./styles-page-nav";

export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderHeading>Find your style or make your own.</PageHeaderHeading>
        <PageHeaderDescription>
          Try our hand-picked styles or create yours from scratch.
        </PageHeaderDescription>
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
