// D4 — light-mode lightness skeleton measurement.
// Measures CIELAB-D65 L* (culori 'lab65') for all Radix light scales and the
// Tailwind v4 palette, derives the 8-step skeleton proposal from the Radix
// median, and verifies the L*-bridge claim (white-text WCAG stability).
//
// Run: node research/d4-lightness-skeleton.mjs   (from packages/colors)
// Outputs: research/data/radix-light-Lstar.json, research/data/skeleton-proposal.json,
//          research/data/tailwind-light-Lstar.json

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import radixNs from "@radix-ui/colors";
const radix = radixNs.default ?? radixNs;
import { converter, formatHex, clampChroma } from "culori";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, "data");
fs.mkdirSync(dataDir, { recursive: true });

const toLab65 = converter("lab65");
const toRgb = converter("rgb");
const toOklch = converter("oklch");

const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

// ---------- WCAG 2 relative luminance on 8-bit sRGB ----------
function srgb8(color) {
  const { r, g, b } = toRgb(color);
  const c8 = (v) => Math.min(255, Math.max(0, Math.round(v * 255)));
  return [c8(r), c8(g), c8(b)];
}
function relLum([r8, g8, b8]) {
  const lin = (v8) => {
    const v = v8 / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r8) + 0.7152 * lin(g8) + 0.0722 * lin(b8);
}
function wcag(fg, bg) {
  const l1 = relLum(srgb8(fg));
  const l2 = relLum(srgb8(bg));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// L* of an sRGB color, D65-based CIELAB (culori 'lab65').
const Lstar = (color) => toLab65(color).l;

// ---------- 1. Radix light scales ----------
const GRAYS = ["gray", "mauve", "slate", "sage", "olive", "sand"];
const lightScaleNames = Object.keys(radix)
  .filter((k) => !/Dark|A$|P3/.test(k))
  .filter((k) => !["blackA", "whiteA"].includes(k))
  .sort();
const chromaticNames = lightScaleNames.filter((n) => !GRAYS.includes(n));

function measureScale(name) {
  const scale = radix[name];
  const steps = {};
  for (let i = 1; i <= 12; i++) {
    const hex = scale[`${name}${i}`];
    steps[i] = round(Lstar(hex), 2);
  }
  return steps;
}

const radixLstar = {
  meta: {
    source: "@radix-ui/colors (light scales, hex)",
    labSpace: "CIELAB D65 (culori 'lab65')",
    chromaticCount: chromaticNames.length,
    grayCount: GRAYS.length,
  },
  chromatic: Object.fromEntries(chromaticNames.map((n) => [n, measureScale(n)])),
  grays: Object.fromEntries(GRAYS.map((n) => [n, measureScale(n)])),
};

// ---------- 2. per-step stats across scales (steps 1-8, skeleton region) ----------
function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const median =
    n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const min = sorted[0];
  const max = sorted[n - 1];
  const sd = Math.sqrt(
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / n,
  );
  return {
    median: round(median, 2),
    mean: round(mean, 2),
    min: round(min, 2),
    max: round(max, 2),
    spread: round(max - min, 2),
    sd: round(sd, 2),
  };
}

function perStepStats(scaleMap, maxStep = 12) {
  const out = {};
  for (let i = 1; i <= maxStep; i++) {
    out[i] = stats(Object.values(scaleMap).map((s) => s[i]));
  }
  return out;
}

radixLstar.stats = {
  chromaticSteps1to12: perStepStats(radixLstar.chromatic),
  graysSteps1to12: perStepStats(radixLstar.grays),
  allSteps1to8: perStepStats(
    { ...radixLstar.chromatic, ...radixLstar.grays },
    8,
  ),
};

fs.writeFileSync(
  path.join(dataDir, "radix-light-Lstar.json"),
  JSON.stringify(radixLstar, null, 2),
);

// ---------- 3. Tailwind v4 palette L* ----------
const twThemePath = path.resolve(
  here,
  "../../../node_modules/.pnpm/tailwindcss@4.3.0/node_modules/tailwindcss/theme.css",
);
const twCss = fs.readFileSync(twThemePath, "utf8");
const twRe =
  /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g;
const twFamilies = {};
for (const m of twCss.matchAll(twRe)) {
  const [, family, step, l, c, h] = m;
  const color = { mode: "oklch", l: +l / 100, c: +c, h: +h };
  (twFamilies[family] ??= {})[step] = round(Lstar(color), 2);
}
const TW_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700"];
const twStats = {};
for (const s of TW_STEPS) {
  twStats[s] = stats(
    Object.values(twFamilies)
      .filter((f) => f[s] != null)
      .map((f) => f[s]),
  );
}
fs.writeFileSync(
  path.join(dataDir, "tailwind-light-Lstar.json"),
  JSON.stringify(
    {
      meta: {
        source: "tailwindcss@4.3.0 theme.css oklch literals",
        labSpace: "CIELAB D65 (culori 'lab65')",
        families: Object.keys(twFamilies).length,
      },
      families: twFamilies,
      statsSteps50to700: twStats,
    },
    null,
    2,
  ),
);

// ---------- 4. Skeleton proposal: fit from Radix chromatic median ----------
// Jobs 1-8: app-bg, subtle-bg, ui-rest, ui-hover, ui-active,
//           border-subtle, border-interactive, border-emphasized.
const JOB_NAMES = [
  "app-bg",
  "subtle-bg",
  "ui-rest",
  "ui-hover",
  "ui-active",
  "border-subtle",
  "border-interactive",
  "border-emphasized",
];
const chromMedians = JOB_NAMES.map(
  (_, i) => radixLstar.stats.chromaticSteps1to12[i + 1].median,
);
// Proposed skeleton: chromatic median rounded to 0.5 L* (documentable numbers).
const proposal = chromMedians.map((m) => Math.round(m * 2) / 2);
const residuals = proposal.map((p, i) => round(p - chromMedians[i], 2));

// Per-scale residuals vs proposal (how far each Radix scale sits from it).
const perScaleRms = {};
for (const [name, steps] of Object.entries(radixLstar.chromatic)) {
  const sq = JOB_NAMES.map((_, i) => (steps[i + 1] - proposal[i]) ** 2);
  perScaleRms[name] = round(Math.sqrt(sq.reduce((a, b) => a + b, 0) / 8), 2);
}
const rmsValues = Object.values(perScaleRms);
const overallRms = round(
  Math.sqrt(rmsValues.reduce((a, b) => a + b ** 2, 0) / rmsValues.length),
  2,
);

// ---------- 5. L*-bridge verification ----------
// White text WCAG across 36 hues (every 10 deg), C = 0.15, gamut-mapped by
// constant-L/H chroma reduction (culori clampChroma in oklch).
const WHITE = { mode: "rgb", r: 1, g: 1, b: 1 };
const HUES = Array.from({ length: 36 }, (_, i) => i * 10);

function mapped(l, c, h) {
  return clampChroma({ mode: "oklch", l, c, h }, "oklch");
}

// Fixed OKLCH L: pick the L whose neutral gray has L* = 50 (solid region),
// so both halves of the experiment are centered on the same lightness.
function oklchLforLstarGray(targetLstar) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (Lstar({ mode: "oklch", l: mid, c: 0, h: 0 }) < targetLstar) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const TARGET_LSTAR = 50;
const FIXED_OKLCH_L = oklchLforLstarGray(TARGET_LSTAR);

const fixedOklch = HUES.map((h) => {
  const color = mapped(FIXED_OKLCH_L, 0.15, h);
  return {
    hue: h,
    hex: formatHex(color),
    Lstar: round(Lstar(color), 2),
    wcagWhite: round(wcag(WHITE, color), 3),
  };
});

// Fixed CIELAB L*: per hue, solve OKLCH L (with C=0.15 gamut-mapped) so the
// resulting sRGB color's L* equals TARGET_LSTAR.
function solveOklchLForLstar(targetLstar, c, h) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (Lstar(mapped(mid, c, h)) < targetLstar) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const fixedLstar = HUES.map((h) => {
  const l = solveOklchLForLstar(TARGET_LSTAR, 0.15, h);
  const color = mapped(l, 0.15, h);
  return {
    hue: h,
    oklchL: round(l, 4),
    hex: formatHex(color),
    Lstar: round(Lstar(color), 2),
    wcagWhite: round(wcag(WHITE, color), 3),
  };
});

function driftReport(rows) {
  const ratios = rows.map((r) => r.wcagWhite);
  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  return {
    min: round(min, 3),
    max: round(max, 3),
    driftPct: round(((max - min) / min) * 100, 2),
  };
}

const bridge = {
  method:
    "White-text WCAG2 ratio across 36 hues (every 10deg), C=0.15 gamut-mapped by constant-L/H chroma reduction (culori clampChroma oklch). Fixed OKLCH L chosen so neutral gray hits L*=50; fixed-L* pass solves OKLCH L per hue for CIELAB-D65 L*=50.",
  fixedOklchL: { value: round(FIXED_OKLCH_L, 4), ...driftReport(fixedOklch), samples: fixedOklch },
  fixedCielabLstar: { value: TARGET_LSTAR, ...driftReport(fixedLstar), samples: fixedLstar },
};

const skeletonProposal = {
  meta: {
    decision: "D4",
    labSpace: "CIELAB D65 (culori 'lab65')",
    fitSource:
      "median L* of the 25 @radix-ui/colors light chromatic scales, steps 1-8, rounded to 0.5 L*",
  },
  jobs: JOB_NAMES.map((name, i) => ({
    job: name,
    step: i + 1,
    tailwindName: ["25", "50", "100", "200", "300", "400", "500", "600"][i],
    proposedLstar: proposal[i],
    radixChromaticMedian: chromMedians[i],
    radixChromaticSpread: radixLstar.stats.chromaticSteps1to12[i + 1].spread,
    radixGrayMedian: radixLstar.stats.graysSteps1to12[i + 1].median,
    residualVsMedian: residuals[i],
  })),
  fitResiduals: {
    proposalVsMedianMaxAbs: round(Math.max(...residuals.map(Math.abs)), 2),
    perScaleRmsVsProposal: perScaleRms,
    overallRms,
  },
  lstarBridge: bridge,
};

fs.writeFileSync(
  path.join(dataDir, "skeleton-proposal.json"),
  JSON.stringify(skeletonProposal, null, 2),
);

// ---------- console summary ----------
console.log("Radix light chromatic scales:", chromaticNames.length);
console.log("\nPer-step L* (chromatic median | mean | spread | gray median):");
for (let i = 1; i <= 8; i++) {
  const c = radixLstar.stats.chromaticSteps1to12[i];
  const g = radixLstar.stats.graysSteps1to12[i];
  console.log(
    `  step ${i}: ${c.median} | ${c.mean} | ${c.spread} | gray ${g.median}`,
  );
}
console.log("\nTailwind steps 50-700 (median | mean | spread):");
for (const s of TW_STEPS) {
  const t = twStats[s];
  console.log(`  ${s}: ${t.median} | ${t.mean} | ${t.spread}`);
}
console.log("\nProposed skeleton (jobs 1-8):", proposal.join(", "));
console.log("Residual vs median (max abs):", Math.max(...residuals.map(Math.abs)));
console.log("Overall per-scale RMS vs proposal:", overallRms);
console.log("\nL* bridge:");
console.log(
  `  fixed OKLCH L=${round(FIXED_OKLCH_L, 4)}: WCAG white ${bridge.fixedOklchL.min}-${bridge.fixedOklchL.max} (drift ${bridge.fixedOklchL.driftPct}%)`,
);
console.log(
  `  fixed CIELAB L*=50:  WCAG white ${bridge.fixedCielabLstar.min}-${bridge.fixedCielabLstar.max} (drift ${bridge.fixedCielabLstar.driftPct}%)`,
);
