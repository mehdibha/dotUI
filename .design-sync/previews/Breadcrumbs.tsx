import { HomeIcon } from 'lucide-react'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from 'www'

const wrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 20 }

export const Basic = () => (
  <Breadcrumbs>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumbs>
)

export const WithIcon = () => (
  <Breadcrumbs>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">
        <HomeIcon />
        Home
      </BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink>Billing</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumbs>
)

export const CustomSeparator = () => (
  <Breadcrumbs>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Docs</BreadcrumbLink>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumbs>
)
