import type { Registry } from "shadcn/registry";

export const featuredBlocks = ["login-01", "register-01"] as const;

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Showcase", slug: "showcase" },
  { name: "Authentication", slug: "authentication" },
  { name: "Tables", slug: "tables" },
  { name: "Application", slug: "application" },
];

export const registryBlocks: Registry["items"] = [
  {
    name: "login-01",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "text-field"],
    files: [
      {
        path: "blocks/auth/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/auth/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication"],
  },
  {
    name: "register-01",
    description: "A simple register form.",
    type: "registry:block",
    registryDependencies: ["button", "text-field"],
    files: [
      {
        path: "blocks/auth/register-01/page.tsx",
        target: "app/register/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/auth/register-01/components/register-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication"],
  },
  {
    name: "all-components",
    description: "Components overview",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/showcase/all-components/page.tsx",
        target: "app/all-components/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["showcase"],
  },
  {
    name: "backlog",
    description: "Components overview",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/tables/backlog/page.tsx",
        target: "app/table/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["table"],
  },
  {
    name: "invite-members",
    description: "Invite members to your team.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/invite-members/page.tsx",
        target: "app/application/invite-members/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["application"],
  },
  {
    name: "account-menu",
    description: "Account menu.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/account-menu/page.tsx",
        target: "app/application/account-menu/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["application"],
  },
  {
    name: "booking",
    description: "Booking calendar.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/calendars/booking/page.tsx",
        target: "app/calendars/booking/page.tsx",
        type: "registry:page",
      },
    ],
  },
  {
    name: "blocks-showcase",
    description: "Blocks showcase",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/showcase/blocks-showcase/page.tsx",
        target: "app/blocks-showcase/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["showcase"],
  },
];
