import { Breadcrumb, Breadcrumbs } from "@dotui/ui/components/breadcrumbs";
import { HomeIcon } from "@dotui/ui/icons";

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
