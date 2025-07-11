import type { Registry } from "shadcn/registry";

export const featuredBlocks = ["login-01", "register-01"] as const;

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Authentication", slug: "authentication" },
];

export const registryBlocks: Registry["items"] = [
  {
    name: "login-01",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "text-field"],
    files: [
      {
        path: "blocks/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-01/components/login-form.tsx",
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
        path: "blocks/register-01/page.tsx",
        target: "app/register/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/register-01/components/register-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication"],
  },
];
