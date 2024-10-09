// source.config.ts
import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";
import { z } from "zod";

// src/lib/mdx-plugins/remark-install.ts
import { visit } from "unist-util-visit";
import convert from "npm-to-yarn";

// src/lib/mdx-plugins/utils.ts
function createElement(name, attributes, children) {
  const element = {
    type: "mdxJsxFlowElement",
    name,
    attributes
  };
  if (children) element.children = children;
  return element;
}
function expressionToAttribute(key, value) {
  return {
    type: "mdxJsxAttribute",
    name: key,
    value: {
      type: "mdxJsxAttributeValueExpression",
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: value
            }
          ]
        }
      }
    }
  };
}

// src/lib/mdx-plugins/remark-install.ts
function remarkInstall({
  Tab = "Tab",
  Tabs = "Tabs",
  persist = false,
  packageManagers = [
    { command: (cmd) => convert(cmd, "npm"), name: "npm" },
    { command: (cmd) => convert(cmd, "pnpm"), name: "pnpm" },
    { command: (cmd) => convert(cmd, "yarn"), name: "yarn" },
    { command: (cmd) => convert(cmd, "bun"), name: "bun" }
  ]
} = {}) {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (node.lang !== "package-install") return "skip";
      const value = node.value.startsWith("npm") || node.value.startsWith("npx") ? node.value : `npm install ${node.value}`;
      const insert = createElement(
        Tabs,
        [
          ...typeof persist === "object" ? [
            {
              type: "mdxJsxAttribute",
              name: "groupId",
              value: persist.id
            },
            {
              type: "mdxJsxAttribute",
              name: "persist",
              value: null
            }
          ] : [],
          expressionToAttribute("items", {
            type: "ArrayExpression",
            elements: packageManagers.map(({ name }) => ({
              type: "Literal",
              value: name
            }))
          })
        ],
        packageManagers.map(({ command, name }) => ({
          type: "mdxJsxFlowElement",
          name: Tab,
          attributes: [
            { type: "mdxJsxAttribute", name: "value", value: name }
          ].filter(Boolean),
          children: [
            {
              type: "code",
              lang: "bash",
              meta: node.meta,
              value: command(value)
            }
          ]
        }))
      );
      Object.assign(node, insert);
    });
  };
}

// src/lib/mdx-plugins/remark-inline-code.ts
import { visit as visit2 } from "unist-util-visit";
import { toString } from "hast-util-to-string";
function remarkInlineCode() {
  return (tree) => {
    visit2(tree, "inlineCode", (node) => {
      const raw = toString(node);
      const match = raw.match(/(.+)\{:([\w-]+)\}$/);
      node.value = match?.[2] ? node.value : `${node.value}{:tsx}`;
    });
  };
}

// source.config.ts
var { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      links: z.array(
        z.object({
          label: z.string(),
          href: z.string()
        })
      ).optional()
    })
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional()
    })
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [
        remarkInstall,
        {
          Tabs: "InstallTabs",
          Tab: "InstallTab"
        }
      ],
      [remarkInlineCode]
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed"
      },
      inline: "tailing-curly-colon",
      defaultLanguage: "ts"
    }
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
