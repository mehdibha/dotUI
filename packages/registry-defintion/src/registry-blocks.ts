import type { Registry } from "shadcn/registry";

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
    categories: ["authentication", "login"],
  },
  {
    name: "calendar-01",
    description: "A simple calendar.",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-01.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-start md:py-20 justify-center min-w-0",
      mobile: "component",
    },
  },
];
