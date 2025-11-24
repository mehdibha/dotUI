import type { JSXTemplate } from "@/modules/docs/interactive-demo/types";

export const buttonInteractiveTemplate: JSXTemplate = {
  imports: [
    {
      module: "@dotui/registry/ui/button",
      members: ["Button"],
    },
  ],
  tree: {
    type: "element",
    name: "Button",
    props: [
      {
        kind: "enum",
        name: "variant",
        prop: "variant",
        values: {
          default: "default",
          primary: "primary",
          quiet: "quiet",
          link: "link",
          success: "success",
          warning: "warning",
          danger: "danger",
        },
        omitIfValue: "default",
      },
      {
        kind: "enum",
        name: "size",
        prop: "size",
        values: {
          sm: "sm",
          md: "md",
          lg: "lg",
        },
        omitIfValue: "md",
      },
      {
        kind: "boolean",
        name: "isPending",
        prop: "isPending",
        omitIfFalse: true,
      },
      {
        kind: "boolean",
        name: "isDisabled",
        prop: "isDisabled",
        omitIfFalse: true,
      },
    ],
    children: [
      {
        type: "text",
        prop: "children",
        trim: true,
      },
    ],
  },
};

