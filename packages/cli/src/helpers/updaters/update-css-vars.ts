import { promises as fs } from "fs";
import path from "path";
import { Config } from "@/helpers/get-config";
import { registryItemCssVarsSchema } from "@/helpers/registry/schema";
import { spinner, highlight } from "@/utils";
import postcss from "postcss";
import AtRule from "postcss/lib/at-rule";
import Root from "postcss/lib/root";
import Rule from "postcss/lib/rule";
import { z } from "zod";

export async function updateCssVars(
  cssVars: z.infer<typeof registryItemCssVarsSchema> | undefined,
  config: Config
) {
  if (
    !cssVars ||
    !Object.keys(cssVars).length ||
    !config.resolvedPaths.tailwindCss
  ) {
    return;
  }

  const cssFilepath = config.resolvedPaths.tailwindCss;
  const cssFilepathRelative = path.relative(
    config.resolvedPaths.cwd,
    cssFilepath
  );
  const cssVarsSpinner = spinner(
    `Updating ${highlight.info(cssFilepathRelative)}`
  ).start();
  const raw = await fs.readFile(cssFilepath, "utf8");
  let output = await transformCssVars(raw, cssVars, config);
  await fs.writeFile(cssFilepath, output, "utf8");
  cssVarsSpinner.succeed();
}

export async function transformCssVars(
  input: string,
  cssVars: z.infer<typeof registryItemCssVarsSchema>,
  config: Config,
) {
  const plugins = [updateCssVarsPlugin(cssVars)];
  // const cleanupDefaultNextStyles = false
  // if (options.cleanupDefaultNextStyles) {
  //   plugins.push(cleanupDefaultNextStylesPlugin());
  // }

  // TODO
  // Only add the base layer plugin if we're using css variables.
  // if (config.tailwind.cssVariables) {
  plugins.push(updateBaseLayerPlugin());
  // }

  const result = await postcss(plugins).process(input, {
    from: undefined,
  });

  return result.css;
}

function updateBaseLayerPlugin() {
  return {
    postcssPlugin: "update-base-layer",
    Once(root: Root) {
      const requiredRules = [
        { selector: "*", apply: "border-border" },
        { selector: "body", apply: "bg-background text-foreground" },
      ];

      let baseLayer = root.nodes.find(
        (node): node is AtRule =>
          node.type === "atrule" &&
          node.name === "layer" &&
          node.params === "base" &&
          requiredRules.every(({ selector, apply }) =>
            node.nodes?.some(
              (rule): rule is Rule =>
                rule.type === "rule" &&
                rule.selector === selector &&
                rule.nodes.some(
                  (applyRule): applyRule is AtRule =>
                    applyRule.type === "atrule" &&
                    applyRule.name === "apply" &&
                    applyRule.params === apply
                )
            )
          )
      ) as AtRule | undefined;

      if (!baseLayer) {
        baseLayer = postcss.atRule({
          name: "layer",
          params: "base",
          raws: { semicolon: true, between: " ", before: "\n" },
        });
        root.append(baseLayer);
      }

      requiredRules.forEach(({ selector, apply }) => {
        const existingRule = baseLayer?.nodes?.find(
          (node): node is Rule =>
            node.type === "rule" && node.selector === selector
        );

        if (!existingRule) {
          baseLayer?.append(
            postcss.rule({
              selector,
              nodes: [
                postcss.atRule({
                  name: "apply",
                  params: apply,
                  raws: { semicolon: true, before: "\n    " },
                }),
              ],
              raws: { semicolon: true, between: " ", before: "\n  " },
            })
          );
        }
      });
    },
  };
}

function updateCssVarsPlugin(
  cssVars: z.infer<typeof registryItemCssVarsSchema>
) {
  return {
    postcssPlugin: "update-css-vars",
    Once(root: Root) {
      let baseLayer = root.nodes.find(
        (node) =>
          node.type === "atrule" &&
          node.name === "layer" &&
          node.params === "base"
      ) as AtRule | undefined;

      if (!(baseLayer instanceof AtRule)) {
        baseLayer = postcss.atRule({
          name: "layer",
          params: "base",
          nodes: [],
          raws: {
            semicolon: true,
            before: "\n",
            between: " ",
          },
        });
        root.append(baseLayer);
      }

      if (baseLayer !== undefined) {
        // Add variables for each key in cssVars
        Object.entries(cssVars).forEach(([key, vars]) => {
          const selector = key === "light" ? ":root" : `.${key}`;
          // TODO: Fix typecheck.
          addOrUpdateVars(baseLayer as AtRule, selector, vars);
        });
      }
    },
  };
}

function cleanupDefaultNextStylesPlugin() {
  return {
    postcssPlugin: "cleanup-default-next-styles",
    Once(root: Root) {
      const bodyRule = root.nodes.find(
        (node): node is Rule => node.type === "rule" && node.selector === "body"
      );
      if (bodyRule) {
        // Remove color from the body node.
        bodyRule.nodes
          .find(
            (node): node is postcss.Declaration =>
              node.type === "decl" &&
              node.prop === "color" &&
              node.value === "rgb(var(--foreground-rgb))"
          )
          ?.remove();

        // Remove background: linear-gradient.
        bodyRule.nodes
          .find((node): node is postcss.Declaration => {
            return (
              node.type === "decl" &&
              node.prop === "background" &&
              // This is only going to run on create project, so all good.
              node.value.startsWith("linear-gradient")
            );
          })
          ?.remove();

        // If the body rule is empty, remove it.
        if (bodyRule.nodes.length === 0) {
          bodyRule.remove();
        }
      }
    },
  };
}

function addOrUpdateVars(
  baseLayer: AtRule,
  selector: string,
  vars: Record<string, string>
) {
  let ruleNode = baseLayer.nodes?.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  );

  if (!ruleNode) {
    if (Object.keys(vars).length > 0) {
      ruleNode = postcss.rule({
        selector,
        raws: { between: " ", before: "\n  " },
      });
      baseLayer.append(ruleNode);
    }
  }

  Object.entries(vars).forEach(([key, value]) => {
    const prop = `--${key.replace(/^--/, "")}`;
    const newDecl = postcss.decl({
      prop,
      value,
      raws: { semicolon: true },
    });

    const existingDecl = ruleNode?.nodes.find(
      (node): node is postcss.Declaration =>
        node.type === "decl" && node.prop === prop
    );

    existingDecl
      ? existingDecl.replaceWith(newDecl)
      : ruleNode?.append(newDecl);
  });
}
