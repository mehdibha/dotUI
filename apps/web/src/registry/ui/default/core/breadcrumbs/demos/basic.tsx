import {
  Breadcrumbs,
  Breadcrumb,
} from "@/registry/ui/default/core/breadcrumbs";

export default function Demo() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">Components</Breadcrumb>
      <Breadcrumb href="#">Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}
