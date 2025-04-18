import { Breadcrumbs, Breadcrumb } from "@/components/dynamic-core/breadcrumbs";

export default function Demo() {
  return (
    <Breadcrumbs isDisabled>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">Components</Breadcrumb>
      <Breadcrumb>Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}
