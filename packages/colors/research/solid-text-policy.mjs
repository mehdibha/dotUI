// D2 solid-text policy: Lc(white on step 9) across all Radix scales, both
// modes; does |Lc| < 40 exactly predict Radix's official bright scales
// (sky, mint, lime, yellow, amber — the ones that take dark text on solid)?
// Also measures what the candidate dark-text formula
// oklch(0.25, max(0.08*C9, 0.04), H9) delivers on those solids.

import * as radix from "@radix-ui/colors";
import { clampChroma, formatHex } from "culori";
import { writeFileSync } from "node:fs";
import {
  RADIX_ALL,
  apcaLc,
  radixSteps,
  round,
  toOklch,
  wcagRatio,
} from "./lib.mjs";

// Per Radix docs ("Understanding the scale", step 9/10 usage): these five
// scales are bright — solid steps take dark text, not white.
const OFFICIAL_DARK_TEXT = ["sky", "mint", "lime", "yellow", "amber"];
const THRESHOLD = 40;

function darkTextFor(step9Hex) {
  const { c, h } = toOklch(step9Hex);
  const raw = {
    mode: "oklch",
    l: 0.25,
    c: Math.max(0.08 * c, 0.04),
    h: h ?? 0,
  };
  return formatHex(clampChroma(raw, "oklch"));
}

const rows = [];
for (const mode of ["light", "dark"]) {
  for (const name of RADIX_ALL) {
    const steps = radixSteps(radix[mode === "dark" ? `${name}Dark` : name]);
    const step9 = steps[9];
    const lcWhite = apcaLc("#ffffff", step9);
    const official = OFFICIAL_DARK_TEXT.includes(name);
    const predicted = Math.abs(lcWhite) < THRESHOLD;
    const row = {
      mode,
      scale: name,
      step9,
      lcWhiteRaw: round(lcWhite, 2),
      lcWhiteAbs: round(Math.abs(lcWhite), 2),
      wcagWhite: round(wcagRatio("#ffffff", step9), 3),
      officialDarkText: official,
      predictedDarkText: predicted,
      match: official === predicted,
    };
    if (official) {
      const dt = darkTextFor(step9);
      const ok9 = toOklch(step9);
      row.darkText = dt;
      row.darkTextFormulaInput = {
        c9: round(ok9.c, 4),
        h9: round(ok9.h ?? 0, 2),
        cUsed: round(Math.max(0.08 * ok9.c, 0.04), 4),
      };
      row.lcDarkText = round(Math.abs(apcaLc(dt, step9)), 2);
      row.wcagDarkText = round(wcagRatio(dt, step9), 3);
    }
    rows.push(row);
  }
}

function confusion(subset) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (const r of subset) {
    if (r.predictedDarkText && r.officialDarkText) tp++;
    else if (r.predictedDarkText && !r.officialDarkText) fp++;
    else if (!r.predictedDarkText && r.officialDarkText) fn++;
    else tn++;
  }
  return {
    tp,
    fp,
    fn,
    tn,
    precision: tp + fp ? round(tp / (tp + fp), 4) : 1,
    recall: tp + fn ? round(tp / (tp + fn), 4) : 1,
    misclassified: subset
      .filter((r) => !r.match)
      .map((r) => `${r.mode}/${r.scale} (|Lc|=${r.lcWhiteAbs})`),
  };
}

// Threshold separation: how much room does 40 have on each side?
function separation(subset) {
  const dark = subset.filter((r) => r.officialDarkText).map((r) => r.lcWhiteAbs);
  const white = subset
    .filter((r) => !r.officialDarkText)
    .map((r) => r.lcWhiteAbs);
  return {
    darkTextScalesLcRange: [Math.min(...dark), Math.max(...dark)],
    whiteTextScalesLcRange: [Math.min(...white), Math.max(...white)],
    gap: round(Math.min(...white) - Math.max(...dark), 2),
  };
}

const light = rows.filter((r) => r.mode === "light");
const dark = rows.filter((r) => r.mode === "dark");

const result = {
  meta: {
    source: "@radix-ui/colors 3.0.0",
    officialDarkText: OFFICIAL_DARK_TEXT,
    threshold: `predict dark text iff |Lc(white on step9)| < ${THRESHOLD}`,
    darkTextFormula: "oklch(0.25, max(0.08*C9, 0.04), H9), chroma-clamped to sRGB",
    note: "lcWhiteRaw is signed APCA (white text on step9 is negative-polarity)",
  },
  scales: rows,
  evaluation: {
    light: { ...confusion(light), ...separation(light) },
    dark: { ...confusion(dark), ...separation(dark) },
    combined: { ...confusion(rows), ...separation(rows) },
  },
};

writeFileSync(
  new URL("./data/solid-text-policy.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);

for (const mode of ["light", "dark"]) {
  const subset = rows.filter((r) => r.mode === mode);
  console.log(`\n=== ${mode}: |Lc(white on step9)| sorted ===`);
  console.table(
    [...subset]
      .sort((a, b) => a.lcWhiteAbs - b.lcWhiteAbs)
      .map(({ scale, lcWhiteAbs, wcagWhite, officialDarkText, match }) => ({
        scale,
        lcWhiteAbs,
        wcagWhite,
        officialDarkText,
        match,
      })),
  );
}
console.log("\n=== evaluation ===");
console.log(JSON.stringify(result.evaluation, null, 2));
console.log("\n=== dark-text formula on official bright scales ===");
console.table(
  rows
    .filter((r) => r.officialDarkText)
    .map(({ mode, scale, step9, darkText, lcDarkText, wcagDarkText }) => ({
      mode,
      scale,
      step9,
      darkText,
      lcDarkText,
      wcagDarkText,
    })),
);
