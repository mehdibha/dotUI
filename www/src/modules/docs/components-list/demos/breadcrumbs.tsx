import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from '@/registry/ui/breadcrumbs'

export function BreadcrumbsDemo() {
  return (
    <Breadcrumbs className="flex-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Button</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  )
}
