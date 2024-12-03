import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/dynamic-core/breadcrumbs";
import { ChevronRightCircleIcon } from "@/__icons__";

export default function Demo() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
        <ChevronRightCircleIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
        <ChevronRightCircleIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
        <ChevronRightCircleIcon />
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
