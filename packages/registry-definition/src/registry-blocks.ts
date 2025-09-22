import type { Registry } from "shadcn/schema";

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Featured", slug: "featured" },
];

export const registryBlocks: Registry["items"] = [
  {
    name: "login",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "text-field", "card", "link"],
    files: [
      {
        path: "blocks/auth/login/page.tsx",
        target: "/app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/auth/login/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["featured", "authentication"],
    meta: {
      containerHeight: 600,
    },
  },
  {
    name: "cards",
    description: "A set of cards.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/showcase/cards/page.tsx",
        type: "registry:page",
        target: "/app/cards/page.tsx",
      },
      {
        path: "blocks/showcase/cards/components/cards.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/account-menu.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/backlog.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/booking.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/color-editor.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/filters.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/invite-members.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/login-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/notifications.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/showcase/cards/components/team-name.tsx",
        type: "registry:component",
      },
    ],
    categories: ["featured", "showcase"],
    meta: {
      containerHeight: 600,
    },
  },
];
