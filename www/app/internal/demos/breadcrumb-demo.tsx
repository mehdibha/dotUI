"use client";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry-v2/ui/breadcrumbs";

export function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/products">Products</Breadcrumb>
        <Breadcrumb href="/products/electronics">Electronics</Breadcrumb>
        <Breadcrumb>Laptop</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/docs">Documentation</Breadcrumb>
        <Breadcrumb>Components</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/settings">Settings</Breadcrumb>
        <Breadcrumb href="/settings/profile">Profile</Breadcrumb>
        <Breadcrumb href="/settings/profile/account">Account</Breadcrumb>
        <Breadcrumb>Personal Information</Breadcrumb>
      </Breadcrumbs>

      <Breadcrumbs>
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>Current Page</Breadcrumb>
      </Breadcrumbs>
    </div>
  );
}
