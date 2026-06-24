import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from '@/registry/ui/breadcrumbs'

// The card itself is an <a>; an href here would render nested anchors. Omitting
// it makes RAC render spans (same breadcrumb-link styles), which is correct for
// an inert preview.
export function BreadcrumbsDemo() {
  return (
    <Breadcrumbs className="flex-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink>Home</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Docs</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Button</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  )
}
