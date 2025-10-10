"use client";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry-v2/ui/breadcrumbs";

export function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">Products</Breadcrumb>
        <Breadcrumb href="#">Electronics</Breadcrumb>
        <Breadcrumb>Laptop</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">Documentation</Breadcrumb>
        <Breadcrumb>Components</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">Settings</Breadcrumb>
        <Breadcrumb href="#">Profile</Breadcrumb>
        <Breadcrumb href="#">Account</Breadcrumb>
        <Breadcrumb>Personal Information</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb>Current Page</Breadcrumb>
      </Breadcrumbs>
    </div>
  );
}
