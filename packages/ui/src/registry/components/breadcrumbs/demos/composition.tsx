import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs,
} from "@dotui/ui/components/breadcrumbs";
import { ArrowRightCircleIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
        <ArrowRightCircleIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
        <ArrowRightCircleIcon />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
