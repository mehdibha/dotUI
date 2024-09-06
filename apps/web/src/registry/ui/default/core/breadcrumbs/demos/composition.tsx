import { ChevronRightSquareIcon } from "@/lib/icons";
import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/registry/ui/default/core/breadcrumbs";

export default function Demo() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
        <ChevronRightSquareIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
        <ChevronRightSquareIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
        <ChevronRightSquareIcon />
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
