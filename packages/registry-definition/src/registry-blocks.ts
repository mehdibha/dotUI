import type { Registry } from "shadcn/schema";

export const blocksCategories: { name: string; slug: string }[] = [
  { name: "Featured", slug: "featured" },
  { name: "Showcase", slug: "showcase" },
  { name: "Authentication", slug: "authentication" },
  { name: "Tables", slug: "tables" },
  { name: "Application", slug: "application" },
  { name: "Calendars", slug: "calendars" },
];

export const registryBlocks: Registry["items"] = [
  {
    name: "login",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "text-field", "card"],
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
  },
  {
    name: "backlog",
    description: "Components overview",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/tables/backlog/components/backlog.tsx",
        type: "registry:component",
      },
    ],
    categories: ["tables"],
  },
  {
    name: "invite-members",
    description: "Invite members to your team.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/invite-members/components/invite-members.tsx",
        type: "registry:component",
      },
    ],
    categories: ["application"],
  },
  {
    name: "team-name",
    description: "Update your team's name.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/team-name/components/team-name.tsx",
        type: "registry:component",
      },
    ],
    categories: ["application"],
  },
  {
    name: "color-editor",
    description: "Edit accent color.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/color-editor/components/accent-color-editor.tsx",
        type: "registry:component",
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
        path: "blocks/application/account-menu/components/account-menu.tsx",
        type: "registry:component",
      },
    ],
    categories: ["application"],
  },
  {
    name: "notifications",
    description: "Notifications panel.",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/application/notifications/components/notifications.tsx",
        type: "registry:component",
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
        path: "blocks/calendars/booking/components/booking.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendars"],
  },
  {
    name: "blocks-showcase",
    description: "Blocks showcase",
    type: "registry:block",
    registryDependencies: ["all"],
    files: [
      {
        path: "blocks/showcase/blocks-showcase/page.tsx",
        type: "registry:page",
        target: "/app/blocks-showcase/page.tsx",
      },
      {
        path: "blocks/showcase/blocks-showcase/components/blocks-showcase.tsx",
        type: "registry:component",
      },
    ],
    categories: ["showcase"],
  },
];
