import fs from "node:fs";
import path from "node:path";
import Color from "colorjs.io";

const filePath = path.resolve(process.cwd(), "www/styles/globals.css");

/**
 * Convert a CSS color string to OKLCH string using colorjs.io
 */
function toOKLCH(input) {
  try {
    const c = new Color(input);
    return c.to("oklch").toString();
  } catch (_e) {
    return input;
  }
}

/**
 * Replace all color literals with OKLCH in a CSS string
 */
function replaceColors(css) {
  const patterns = [
    /hsl\([^\)]+\)/gi,
    /hsla\([^\)]+\)/gi,
    /rgb\([^\)]+\)/gi,
    /rgba\([^\)]+\)/gi,
    /#[0-9a-fA-F]{3,8}\b/g,
  ];

  let result = css;
  for (const pattern of patterns) {
    result = result.replace(pattern, (match) => toOKLCH(match));
  }
  return result;
}

const original = fs.readFileSync(filePath, "utf8");
const converted = replaceColors(original);

if (converted !== original) {
  fs.writeFileSync(filePath, converted, "utf8");
  console.log("Converted colors in:", filePath);
} else {
  console.log("No changes needed:", filePath);
}

