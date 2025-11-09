import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-layout";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";

const title = "Blocks that don't lock you in.";
const description = "Modern UI blocks available in infinite styles.";

export default function BlocksPageHeader() {
  return (
    <PageHeader className="apply-parent-relative">
      <PageHeaderHeading>{title}</PageHeaderHeading>
      <PageHeaderDescription>{description}</PageHeaderDescription>
      <PageActions>
        <ActiveStyleSelector buttonProps={{ className: "px-4" }} />
      </PageActions>
    </PageHeader>
  );
}
