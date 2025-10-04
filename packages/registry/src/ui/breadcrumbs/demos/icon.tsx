import { HomeIcon } from "@dotui/registry/icons";
import { Breadcrumb, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

export default function Demo() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="#">
        <HomeIcon />
        Home
      </Breadcrumb>
      <Breadcrumb href="#">Components</Breadcrumb>
      <Breadcrumb href="#">Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}
