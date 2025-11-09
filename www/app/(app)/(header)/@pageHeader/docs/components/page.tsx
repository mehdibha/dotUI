import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-layout";

const title = "Components";
const description = "Browse all available components in the library.";

export default function BlocksPageHeader() {
  return (
    <PageHeader className="full-page-sticky">
      <PageHeaderHeading>{title}</PageHeaderHeading>
      <PageHeaderDescription>{description}</PageHeaderDescription>
    </PageHeader>
  );
}
