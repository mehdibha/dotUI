export type RegistryType = "registry:core" | "registry:hook" | "registry:lib";

export type RegistryItem = Prettify<
  {
    name: string;
    type: RegistryType;
    description?: string;
  } & (
    | {
        dependencies?: string[];
        registryDependencies?: string[];
        files: {
          path: string;
          type: RegistryType;
          target: string;
        }[];
      }
    | {
        variants: (
          | {
              name: string;
              label?: string;
              description?: string;
            }
          | string
        )[];
      }
  )
>;

export type Registry = RegistryItem[];

export const core: Registry = [
  {
    name: "alert",
    type: "registry:core",
    variants: ["basic", "notch", "notch-2"],
  },
  {
    name: "alert_basic",
    description: "Minimal with a subtle border and muted background.",
    type: "registry:core",
    files: [
      {
        path: "core/alert_basic.tsx",
        type: "registry:core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch",
    description: "Alert with a bold left border for emphasis.",
    type: "registry:core",
    files: [
      {
        path: "core/alert_notch.tsx",
        type: "registry:core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "alert_notch-2",
    description:
      "Alert with a bold left border for emphasis and muted background.",
    type: "registry:core",
    files: [
      {
        path: "core/alert_notch.tsx",
        type: "registry:core",
        target: "core/alert.tsx",
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:core",
    files: [
      {
        path: "core/avatar_basic.tsx",
        type: "registry:core",
        target: "core/avatar.tsx",
      },
    ],
  },
];
