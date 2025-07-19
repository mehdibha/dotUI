const plugin = require("tailwindcss/plugin");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
];

function getTailwindCssFile(cwd) {
  const files = fg.globSync(["**/*.css", "**/*.scss"], {
    cwd,
    deep: 5,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    console.log("No css files found in", cwd);
    return null;
  }

  for (const file of files) {
    const contents = fs.readFileSync(path.resolve(cwd, file), "utf8");
    if (
      contents.includes(`@import "tailwindcss"`) ||
      contents.includes(`@import 'tailwindcss'`)
    ) {
      return file;
    }
  }

  return null;
}

function readCssVars(rawCss) {
  const result = {};

  try {
    const root = postcss.parse(rawCss);

    root.walkRules((rule) => {
      const selector = rule.selector.trim();

      let theme = null;

      if (selector === ":root") {
        theme = "light";
      } else if (selector === ".dark" || selector === ":root.dark") {
        theme = "dark";
      } else if (selector.startsWith(".")) {
        theme = selector.slice(1);
      }

      if (theme) {
        if (!result[theme]) {
          result[theme] = {};
        }

        rule.walkDecls((decl) => {
          if (decl.prop.startsWith("--")) {
            const varName = decl.prop.slice(2);
            result[theme][varName] = decl.value.trim();
          }
        });
      }
    });

    root.walkAtRules("layer", (atRule) => {
      if (atRule.params === "base") {
        atRule.walkRules((rule) => {
          const selector = rule.selector.trim();
          let theme = null;

          if (selector === ":root") {
            theme = "light";
          } else if (selector === ".dark" || selector === ":root.dark") {
            theme = "dark";
          } else if (selector.startsWith(".")) {
            theme = selector.slice(1);
          }

          if (theme) {
            if (!result[theme]) {
              result[theme] = {};
            }

            rule.walkDecls((decl) => {
              if (decl.prop.startsWith("--")) {
                const varName = decl.prop.slice(2);
                result[theme][varName] = decl.value.trim();
              }
            });
          }
        });
      }
    });
  } catch (error) {
    return null;
  }

  return result;
}

const getContrastCssVars = (cssVars) => {
  const result = {};

 
}

const autoContrast = plugin(function ({ addBase, theme }) {
  const cwd = process.cwd();
  const cssFilePath = getTailwindCssFile(cwd);
  const cssFilePathRelative = path.relative(cwd, cssFilePath);

  const rawCss = fs.readFileSync(cssFilePathRelative, "utf8");

  const cssVars = readCssVars(rawCss);



  addBase({
    ":root": {
      "--on-danger-400": "black",
    },
  });
});

module.exports = autoContrast;
