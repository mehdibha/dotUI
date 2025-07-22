import type { Registry } from "shadcn/registry";

export const featuredBlocks = ["login-01", "register-01"] as const;

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Overview", slug: "overview" },
  { name: "Authentication", slug: "authentication" },
  { name: "Tables", slug: "table" },
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
    name: "overview-01",
    description: "Components overview",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/overview/overview-01/page.tsx",
        target: "app/overview/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["overview"],
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
        path: "blocks/invite-members/page.tsx",
        target: "app/invite-members/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["overview"],
  },
];
