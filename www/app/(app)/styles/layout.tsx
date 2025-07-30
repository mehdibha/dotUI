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
import { StylesPageNav } from "./page-nav";

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
          Choose a style to get started or create your own.
        </PageHeaderDescription>
        <PageActions>
          <CreateStyleModal>
            <Button variant="primary">Create your style</Button>
          </CreateStyleModal>
        </PageActions>
      </PageHeader>
      <StylesPageNav>{children}</StylesPageNav>
    </PageLayout>
  );
}
