import type { JSXTemplate } from "@/modules/docs/interactive-demo/types";

export const selectInteractiveTemplate: JSXTemplate = {
  imports: [
    {
      module: "@dotui/registry/ui/select",
      members: ["Select", "SelectContent", "SelectItem", "SelectTrigger"],
    },
    {
      module: "@dotui/registry/ui/field",
      members: ["Label"],
    },
  ],
  tree: {
    type: "element",
    name: "Select",
    props: [
      {
        kind: "string",
        name: "placeholder",
        prop: "placeholder",
        trim: true,
        omitIfEmpty: true,
      },
      {
        kind: "enum",
        name: "selectionMode",
        prop: "selectionMode",
        values: {
          single: "single",
          multiple: "multiple",
        },
        omitIfValue: "single",
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
        type: "element",
        name: "Label",
        condition: {
          kind: "propNotEmpty",
          prop: "label",
          trim: true,
        },
        children: [
          {
            type: "text",
            prop: "label",
            trim: true,
          },
        ],
      },
      {
        type: "element",
        name: "SelectTrigger",
      },
      {
        type: "element",
        name: "SelectContent",
        children: [
          {
            type: "element",
            name: "SelectItem",
            children: [
              {
                type: "text",
                value: "Perplexity",
              },
            ],
          },
          {
            type: "element",
            name: "SelectItem",
            children: [
              {
                type: "text",
                value: "Replicate",
              },
            ],
          },
          {
            type: "element",
            name: "SelectItem",
            children: [
              {
                type: "text",
                value: "Together AI",
              },
            ],
          },
          {
            type: "element",
            name: "SelectItem",
            children: [
              {
                type: "text",
                value: "ElevenLabs",
              },
            ],
          },
        ],
      },
    ],
  },
};

