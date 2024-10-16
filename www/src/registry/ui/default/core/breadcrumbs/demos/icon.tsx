import {
  Breadcrumbs,
  Breadcrumb,
} from "@/registry/ui/default/core/breadcrumbs";
import { HomeIcon } from "@/__icons__";

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
