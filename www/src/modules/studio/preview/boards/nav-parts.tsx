"use client"

import { cn } from "@/registry/lib/utils"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"

/** Two crumbs: a frozen ancestor (`children`) and the current page. */
export function BreadcrumbTrail({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Breadcrumbs className={cn("flex-nowrap", className)}>
      <BreadcrumbItem>
        {children}
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Settings</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  )
}
