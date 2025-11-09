import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-layout";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";

const title = "Components";
const description = "Browse all available components in the library.";

export default function BlocksPageHeader() {
  return (
    <PageHeader className="full-page-sticky">
      <PageHeaderHeading>{title}</PageHeaderHeading>
      <PageHeaderDescription>{description}</PageHeaderDescription>
      <PageActions>
        <ActiveStyleSelector buttonProps={{ className: "px-4" }} />
      </PageActions>
    </PageHeader>
  );
}
