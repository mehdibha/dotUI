import Link from "next/link";

import { Button } from "@dotui/registry/ui/button";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-layout";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";

const title = "Find your style or make your own.";
const description = "Try our hand-picked styles or create yours from scratch.";

export default function StylesPageHeader() {
  return (
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
  );
}
