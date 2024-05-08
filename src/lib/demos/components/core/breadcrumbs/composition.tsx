import {
  BreadcrumbsRoot,
  BreadcrumbsEllipsis,
  BreadcrumbsListItem,
  BreadcrumbsLink,
  BreadcrumbsList,
  BreadcrumbsPage,
  BreadcrumbsSeparator,
} from "@/lib/components/core/default/breadcrumbs";
import {
  MenuRoot,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/lib/components/core/default/menu";

export default function BreadcrumbssDemo() {
  return (
    <BreadcrumbsRoot>
      <BreadcrumbsList>
        <BreadcrumbsListItem>
          <BreadcrumbsLink href="/">Home</BreadcrumbsLink>
        </BreadcrumbsListItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsListItem>
          <MenuRoot>
            <MenuTrigger className="flex items-center gap-1">
              <BreadcrumbsEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </MenuTrigger>
            <MenuContent align="start">
              <MenuItem>Documentation</MenuItem>
              <MenuItem>Themes</MenuItem>
              <MenuItem>GitHub</MenuItem>
            </MenuContent>
          </MenuRoot>
        </BreadcrumbsListItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsListItem>
          <BreadcrumbsLink href="/docs/components">Components</BreadcrumbsLink>
        </BreadcrumbsListItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsListItem>
          <BreadcrumbsPage>Breadcrumbs</BreadcrumbsPage>
        </BreadcrumbsListItem>
      </BreadcrumbsList>
    </BreadcrumbsRoot>
  );
}
