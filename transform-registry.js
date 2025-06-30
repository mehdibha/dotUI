const fs = require("fs");
const path = require("path");

function transformRegistry() {
  const registryPath = path.join(
    __dirname,
    "packages/ui/src/registry/registry-ui.ts",
  );

  let content = fs.readFileSync(registryPath, "utf8");

  const lines = content.split("\n");
  const importLine = lines[0];

  const arrayStartIndex = lines.findIndex((line) =>
    line.includes('export const ui: Registry["items"] = ['),
  );
  const arrayEndIndex = lines.findIndex((line) => line.trim() === "]");

  const arrayContent = lines
    .slice(arrayStartIndex + 1, arrayEndIndex)
    .join("\n");

  let registryData;
  try {
    const evalCode = `(${arrayContent.slice(0, -1)})`;
    registryData = eval(evalCode);
  } catch (error) {
    console.error("Error parsing registry data:", error);
    return;
  }

  const transformedData = [];

  for (const item of registryData) {
    if (item.styles && Array.isArray(item.styles)) {
      for (const style of item.styles) {
        const transformedItem = {
          ...style,
          name:
            item.styles.length === 1 ? item.name : `${item.name}:${style.name}`,
        };
        delete transformedItem.name;
        transformedItem.name =
          item.styles.length === 1 ? item.name : `${item.name}:${style.name}`;
        transformedData.push(transformedItem);
      }
    } else {
      transformedData.push(item);
    }
  }

  const newContent = `${importLine}

export const ui: Registry["items"] = ${JSON.stringify(transformedData, null, 2)};
`;

  fs.writeFileSync(registryPath, newContent);
  console.log("Registry transformed successfully!");
  console.log(
    `Transformed ${registryData.length} items into ${transformedData.length} items`,
  );
}

transformRegistry();
