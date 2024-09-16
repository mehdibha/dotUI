import { Registry } from "@/registry/schema";

export const hooks: Registry = [
  {
    name: "use-media-query",
    type: "registry:hook",
    files: ["hooks/use-media-query.ts"],
  },
];
