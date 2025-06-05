import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs,
} from "@/components/dynamic-ui/breadcrumbs";
import { ArrowRightCircleIcon } from "lucide-react";

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
