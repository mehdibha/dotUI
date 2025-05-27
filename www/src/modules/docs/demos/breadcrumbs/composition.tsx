import { ArrowRightCircleIcon } from "lucide-react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/dynamic-ui/breadcrumbs";

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
