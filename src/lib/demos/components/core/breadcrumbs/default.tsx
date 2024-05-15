import { Breadcrumbs, BreadcrumbsItem } from "@/lib/components/core/default/breadcrumbs";

export default function BreadcrumbssDemo() {
  // return null
  return (
    <Breadcrumbs>
      <BreadcrumbsItem>Home</BreadcrumbsItem>
      <BreadcrumbsItem>Components</BreadcrumbsItem>
      <BreadcrumbsItem>Breadcrumbs</BreadcrumbsItem>
    </Breadcrumbs>
  );
}
