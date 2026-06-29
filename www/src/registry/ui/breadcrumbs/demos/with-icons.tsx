import {
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  HomeIcon,
} from '@/registry/__generated__/icons'
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from '@/registry/ui/breadcrumbs'

export default function Demo() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          <HomeIcon />
          My Drive
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          <FolderIcon />
          Projects
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">
          <FolderOpenIcon />
          Q3 Report
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <FileTextIcon />
          Summary.pdf
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  )
}
