// D6 (hue policy) measurement: hue drift per Radix chromatic family (light+dark)
// and per Tailwind v4 family, keyed to OKLCH L rather than step index.
// Deterministic; writes research/data/radix-hue-drift.json and hue-bend-table.json.
//
// Conventions:
// - OKLCH via culori (D65-based, like all of OKLab).
// - Drift dH(step) = signed shortest angular distance H(step) - H(ref), in degrees.
//   Negative = hue decreases (for yellow ~110deg that means toward gold/orange;
//   for blue ~260deg toward cyan). Positive = hue increases (blue -> violet).
// - Radix ref step = 9 (seed-carrying). Tailwind ref step = 600 (its solid slot).
// - Steps with C < CHROMA_FLOOR have perceptually unstable hue and are excluded
//   from fits (still recorded raw).
// - "dark side" = steps with L < L(ref); "light side" = L > L(ref). Keying to L
//   makes light and dark mode directly comparable (in Radix dark mode the dark
//   side is steps 1-8, the light side 10-12).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { oklch } from "culori";

const require = createRequire(import.meta.url);
const radix = require("@radix-ui/colors");

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
mkdirSync(DATA_DIR, { recursive: true });

const CHROMA_FLOOR = 0.03; // below this, OKLCH hue is unreliable

const signedDH = (h, ref) => ((h - ref + 540) % 360) - 180;
const round = (x, d = 3) => (x == null ? null : Number(x.toFixed(d)));

// ---------- Radix ----------

const GRAYS = new Set(["gray", "mauve", "slate", "sage", "olive", "sand"]);
const radixFamilies = Object.keys(radix)
  .filter((k) => !/Dark|A$|P3/.test(k) && !k.endsWith("A"))
  .filter((k) => /^[a-z]+$/.test(k) && !GRAYS.has(k) && !["whiteA", "blackA"].includes(k));

function scaleToOklch(scale, familyKey) {
  return Array.from({ length: 12 }, (_, i) => {
    const hex = scale[`${familyKey}${i + 1}`];
    const c = oklch(hex);
    return {
      step: i + 1,
      hex,
      L: round(c.l, 4),
      C: round(c.c, 4),
      H: c.h == null ? null : round(c.h, 2),
    };
  });
}

// Through-origin least squares of dH vs x (x = Lref - L on dark side, L - Lref on light side)
function fitSlope(points) {
  if (points.length === 0) return null;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sxy += p.x * p.y;
    sxx += p.x * p.x;
  }
  if (sxx === 0) return null;
  const k = sxy / sxx;
  // R^2 against mean-zero model (through-origin convention)
  let ssRes = 0;
  let ssTot = 0;
  for (const p of points) {
    ssRes += (p.y - k * p.x) ** 2;
    ssTot += p.y ** 2;
  }
  return { slopePerL: round(k, 2), r2: ssTot === 0 ? 1 : round(1 - ssRes / ssTot, 3), n: points.length };
}

function analyzeScale(steps, refStep) {
  const ref = steps.find((s) => s.step === refStep);
  const refH = ref.H;
  const refL = ref.L;
  const rows = steps.map((s) => ({
    ...s,
    dH: s.H == null || refH == null ? null : round(signedDH(s.H, refH), 2),
    reliable: s.C >= CHROMA_FLOOR,
  }));
  const usable = rows.filter((s) => s.reliable && s.dH != null && s.step !== refStep);
  const darkSide = usable.filter((s) => s.L < refL);
  const lightSide = usable.filter((s) => s.L > refL);
  const endpoint = (side, pick) =>
    side.length === 0
      ? null
      : side.reduce((a, b) => (pick(a.L, b.L) ? a : b));
  const darkEnd = endpoint(darkSide, (a, b) => a < b); // lowest L
  const lightEnd = endpoint(lightSide, (a, b) => a > b); // highest L
  return {
    refStep,
    refL,
    refH,
    steps: rows,
    dark: {
      fit: fitSlope(darkSide.map((s) => ({ x: refL - s.L, y: s.dH }))),
      endpoint: darkEnd ? { step: darkEnd.step, L: darkEnd.L, C: darkEnd.C, dH: darkEnd.dH } : null,
    },
    light: {
      fit: fitSlope(lightSide.map((s) => ({ x: s.L - refL, y: s.dH }))),
      endpoint: lightEnd ? { step: lightEnd.step, L: lightEnd.L, C: lightEnd.C, dH: lightEnd.dH } : null,
    },
  };
}

const radixOut = {};
for (const fam of radixFamilies) {
  const light = scaleToOklch(radix[fam], fam);
  const darkKey = `${fam}Dark`;
  const dark = scaleToOklch(radix[darkKey], fam);
  const peakC = Math.max(...light.map((s) => s.C));
  radixOut[fam] = {
    // muted: metallic/earth families (bronze, gold, brown) — hue data ends ~L 0.5
    // and they behave like tinted neutrals; excluded from band aggregates.
    muted: peakC < 0.09,
    // bright: solid step 9 is light (dark text on solid); their dark side spans
    // a much larger L range than regular families.
    bright: light[8].L > 0.8,
    peakCLight: round(peakC, 4),
    light: analyzeScale(light, 9),
    dark: analyzeScale(dark, 9),
  };
}

// ---------- Tailwind v4 ----------

const twCss = readFileSync(
  join(
    __dirname,
    "../../..",
    "node_modules/.pnpm/tailwindcss@4.3.0/node_modules/tailwindcss/theme.css"
  ),
  "utf8"
);
const twScales = {};
for (const m of twCss.matchAll(
  /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g
)) {
  const [, fam, step, L, C, H] = m;
  (twScales[fam] ??= []).push({
    step: Number(step),
    L: round(Number(L) / 100, 4),
    C: round(Number(C), 4),
    H: round(Number(H), 2),
  });
}
// Neutral exclusion is data-driven: a family whose peak chroma never reaches
// 0.06 is a (possibly tinted) neutral, not a chromatic ramp.
const twNeutrals = [];
const twOut = {};
for (const [fam, steps] of Object.entries(twScales)) {
  steps.sort((a, b) => a.step - b.step);
  if (Math.max(...steps.map((s) => s.C)) < 0.06) {
    twNeutrals.push(fam);
    continue;
  }
  twOut[fam] = analyzeScale(steps, 600);
  // total span drift 50 -> 950 for cross-checking known numbers
  const s50 = steps.find((s) => s.step === 50);
  const s950 = steps.find((s) => s.step === 950);
  twOut[fam].span50to950 = round(signedDH(s950.H, s50.H), 2);
}

// ---------- Bend classes & hue-band table ----------

// Bands are defined on the light-mode seed hue (Radix step 9 H, degrees).
const BANDS = [
  { name: "pink-magenta", lo: 330, hi: 5 },
  { name: "red", lo: 5, hi: 40 },
  { name: "orange-brown", lo: 40, hi: 75 },
  { name: "gold-amber", lo: 75, hi: 95 },
  { name: "yellow-lime", lo: 95, hi: 135 },
  { name: "green", lo: 135, hi: 168 },
  { name: "teal-cyan", lo: 168, hi: 225 },
  { name: "blue", lo: 225, hi: 262 },
  { name: "indigo-violet", lo: 262, hi: 300 },
  { name: "purple-plum", lo: 300, hi: 330 },
];
const inBand = (h, b) => (b.lo < b.hi ? h >= b.lo && h < b.hi : h >= b.lo || h < b.hi);

function classify(absEnd) {
  if (absEnd == null) return "no-data";
  if (absEnd >= 20) return "strong";
  if (absEnd >= 8) return "moderate";
  return "flat";
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const bendTable = BANDS.map((band) => {
  const all = radixFamilies.filter((f) => {
    const h = radixOut[f].light.refH;
    return h != null && inBand(h, band);
  });
  const fams = all.filter((f) => !radixOut[f].muted);
  const mutedFams = all.filter((f) => radixOut[f].muted);
  const side = (mode, key) => {
    const slopes = fams
      .map((f) => radixOut[f][mode][key].fit?.slopePerL)
      .filter((x) => x != null);
    const ends = fams
      .map((f) => radixOut[f][mode][key].endpoint?.dH)
      .filter((x) => x != null);
    const endLs = fams
      .map((f) => radixOut[f][mode][key].endpoint?.L)
      .filter((x) => x != null);
    const med = median(ends);
    return {
      meanSlopePerL: round(mean(slopes), 2),
      medianSlopePerL: round(median(slopes), 2),
      meanEndpointDH: round(mean(ends), 2),
      medianEndpointDH: round(med, 2),
      meanEndpointL: round(mean(endLs), 3),
      outliers: fams.filter((f) => {
        const e = radixOut[f][mode][key].endpoint?.dH;
        return e != null && med != null && Math.abs(e - med) > 10;
      }),
      perFamily: Object.fromEntries(
        fams.map((f) => [
          f,
          {
            slopePerL: radixOut[f][mode][key].fit?.slopePerL ?? null,
            endpointDH: radixOut[f][mode][key].endpoint?.dH ?? null,
            endpointL: radixOut[f][mode][key].endpoint?.L ?? null,
          },
        ])
      ),
    };
  };
  const light = { towardDark: side("light", "dark"), towardLight: side("light", "light") };
  const dark = { towardDark: side("dark", "dark"), towardLight: side("dark", "light") };
  return {
    band: band.name,
    hRange: [band.lo, band.hi],
    families: fams,
    mutedFamiliesExcluded: mutedFams,
    bendClass: {
      light: classify(Math.abs(light.towardDark.medianEndpointDH ?? 0)),
      dark: classify(Math.abs(dark.towardDark.medianEndpointDH ?? 0)),
    },
    light,
    dark,
  };
});

// ---------- SPEC D6 hypothesis check ----------

const ep = (f, mode, side) => radixOut[f][mode][side].endpoint?.dH ?? null;
const hypothesisCheck = {
  "yellow/amber/orange bend 35-50deg toward gold at dark end": {
    radixLightDarkEnd: {
      yellow: ep("yellow", "light", "dark"),
      amber: ep("amber", "light", "dark"),
      orange: ep("orange", "light", "dark"),
    },
    tailwindSpan50to950: {
      yellow: twOut.yellow.span50to950,
      amber: twOut.amber.span50to950,
      orange: twOut.orange.span50to950,
    },
    verdict:
      "direction confirmed (negative = toward gold/orange); magnitude family-dependent: Tailwind -37..-50deg over full ramp, Radix -14..-30deg from step 9 to 12",
  },
  "blue bends ~13deg toward violet": {
    radixLightDarkEnd: { blue: ep("blue", "light", "dark") },
    radixDarkBgEnd: { blue: ep("blue", "dark", "dark") },
    tailwindSpan50to950: { blue: twOut.blue.span50to950 },
    verdict:
      "confirmed for Tailwind (+13.3deg full ramp); Radix bends less (+7deg light, +9.5deg dark bg side); positive = toward violet",
  },
  "red/green ~flat": {
    radixLightDarkEnd: { red: ep("red", "light", "dark"), green: ep("green", "light", "dark") },
    radixDarkBgEnd: { red: ep("red", "dark", "dark"), green: ep("green", "dark", "dark") },
    tailwindSpan50to950: { red: twOut.red.span50to950, green: twOut.green.span50to950 },
    verdict:
      "roughly confirmed: |drift| < 8deg in light mode; red dark-mode backgrounds drift ~-10deg toward crimson",
  },
};

// ---------- Write fixtures ----------

const meta = {
  generatedBy: "research/d6-hue-drift.mjs",
  decision: "D6",
  space: "OKLCH via culori v4 (D65)",
  chromaFloor: CHROMA_FLOOR,
  driftSign:
    "dH = signed shortest H(step)-H(ref); negative = hue angle decreases",
  radixRefStep: 9,
  tailwindRefStep: 600,
  tailwindVersion: "4.3.0",
  radixVersion: require("@radix-ui/colors/package.json").version,
};

writeFileSync(
  join(DATA_DIR, "radix-hue-drift.json"),
  JSON.stringify(
    { meta, radix: radixOut, tailwind: twOut, tailwindNeutralsExcluded: twNeutrals },
    null,
    2
  )
);
writeFileSync(
  join(DATA_DIR, "hue-bend-table.json"),
  JSON.stringify({ meta, hypothesisCheck, bands: bendTable }, null, 2)
);

// ---------- Console summary ----------

console.log("family        H9(L)   H9(D)  | light dark-side: slope  end(dH@L)   | dark dark-side: slope  end(dH@L)");
for (const fam of radixFamilies) {
  const l = radixOut[fam].light;
  const d = radixOut[fam].dark;
  const fmt = (a) =>
    a.fit
      ? `${String(a.fit.slopePerL).padStart(7)}  ${String(a.endpoint?.dH).padStart(7)}@${a.endpoint?.L}`
      : "      -        -";
  console.log(
    `${fam.padEnd(10)} ${String(l.refH).padStart(6)} ${String(d.refH).padStart(6)}  |  ${fmt(l.dark)}   |  ${fmt(d.dark)}`
  );
}
console.log("\nTailwind (ref 600):");
for (const [fam, a] of Object.entries(twOut)) {
  console.log(
    `${fam.padEnd(10)} H600=${String(a.refH).padStart(7)} darkSlope=${String(a.dark.fit?.slopePerL).padStart(7)} darkEnd=${String(a.dark.endpoint?.dH).padStart(7)} lightEnd=${String(a.light.endpoint?.dH).padStart(7)} span50->950=${a.span50to950}`
  );
}
console.log("\nBend table (median endpoints, outliers flagged):");
for (const b of bendTable) {
  const o = b.light.towardDark.outliers.concat(b.dark.towardDark.outliers);
  console.log(
    `${b.band.padEnd(14)} [${b.hRange}] ${b.families.join(",").padEnd(30)} L-mode dark-end=${b.light.towardDark.medianEndpointDH} (${b.bendClass.light})  D-mode dark-end=${b.dark.towardDark.medianEndpointDH} (${b.bendClass.dark})${o.length ? "  outliers: " + [...new Set(o)].join(",") : ""}`
  );
}
