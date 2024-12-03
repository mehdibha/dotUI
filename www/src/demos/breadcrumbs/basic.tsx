import { Breadcrumbs, Breadcrumb } from "@/components/dynamic-core/breadcrumbs";

export default function Demo() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">Components</Breadcrumb>
      <Breadcrumb href="#">Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}
