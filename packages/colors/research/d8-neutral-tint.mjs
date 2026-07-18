// D8 (neutral tinting) measurement — Radix grays + Tailwind v4 neutrals.
// Deterministic. Run from packages/colors: node research/d8-neutral-tint.mjs
// Writes research/data/radix-grays.json and research/data/neutral-tint-rule.json
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as radix from "@radix-ui/colors";
import { converter } from "culori";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "data");
mkdirSync(dataDir, { recursive: true });

const toOklch = converter("oklch");
const round = (x, d = 4) => (x == null ? null : Number(x.toFixed(d)));

function scaleToSteps(scaleObj) {
  // radix scale objects: { gray1: '#..', ..., gray12: '#..' } in order
  return Object.values(scaleObj).map((hex) => {
    const { l, c, h } = toOklch(hex);
    return { hex, L: round(l), C: round(c), H: c < 1e-4 ? null : round(h, 2) };
  });
}

// circular stats over hue, weighted by chroma (hue is meaningless near C=0)
function hueStats(steps) {
  const pts = steps.filter((s) => s.H != null && s.C >= 0.002);
  if (pts.length === 0) return { mean: null, spread: null, n: 0 };
  let x = 0;
  let y = 0;
  let w = 0;
  for (const s of pts) {
    const r = (s.H * Math.PI) / 180;
    x += s.C * Math.cos(r);
    y += s.C * Math.sin(r);
    w += s.C;
  }
  const mean = ((Math.atan2(y / w, x / w) * 180) / Math.PI + 360) % 360;
  const dev = (h) => {
    let d = Math.abs(h - mean) % 360;
    return d > 180 ? 360 - d : d;
  };
  const devs = pts.map((s) => dev(s.H));
  return {
    mean: round(mean, 2),
    maxDev: round(Math.max(...devs), 2),
    n: pts.length,
  };
}

const hueDiff = (a, b) => {
  if (a == null || b == null) return null;
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return round(d, 2);
};

// ---------- Radix grays ----------
const grayFamilies = ["gray", "mauve", "slate", "sage", "olive", "sand"];
const radixGrays = {};
for (const fam of grayFamilies) {
  radixGrays[fam] = {
    light: scaleToSteps(radix[fam]),
    dark: scaleToSteps(radix[`${fam}Dark`]),
  };
}

// Radix's own documented pairings (from radix-ui.com/colors docs)
const pairings = {
  mauve: ["tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet"],
  slate: ["iris", "indigo", "blue", "sky", "cyan"],
  sage: ["mint", "teal", "jade", "green"],
  olive: ["grass", "lime"],
  sand: ["yellow", "amber", "orange", "brown"],
};

function accentHues(name, mode) {
  const scale = radix[mode === "dark" ? `${name}Dark` : name];
  const steps = scaleToSteps(scale);
  return {
    step9: steps[8].H, // solid — the seed-defining step
    meanCWeighted: hueStats(steps).mean,
  };
}

const summaries = {};
for (const fam of grayFamilies) {
  summaries[fam] = {};
  for (const mode of ["light", "dark"]) {
    const steps = radixGrays[fam][mode];
    const Cs = steps.map((s) => s.C);
    const peakIdx = Cs.indexOf(Math.max(...Cs));
    summaries[fam][mode] = {
      maxC: round(Math.max(...Cs)),
      peakStep: peakIdx + 1,
      C: Cs,
      hue: hueStats(steps),
    };
  }
}

const pairingAnalysis = {};
for (const [fam, accents] of Object.entries(pairings)) {
  pairingAnalysis[fam] = {};
  for (const mode of ["light", "dark"]) {
    const grayHue = summaries[fam][mode].hue.mean;
    pairingAnalysis[fam][mode] = {
      grayHue,
      accents: accents.map((a) => {
        const ah = accentHues(a, mode);
        return {
          accent: a,
          accentH9: ah.step9,
          accentHMean: ah.meanCWeighted,
          offsetFromH9: hueDiff(grayHue, ah.step9),
          offsetFromMean: hueDiff(grayHue, ah.meanCWeighted),
        };
      }),
    };
  }
}

// ---------- Tailwind v4 neutrals ----------
const twTheme = readFileSync(
  join(here, "../../../node_modules/.pnpm/tailwindcss@4.3.0/node_modules/tailwindcss/theme.css"),
  "utf8",
);
const twFamilies = {};
for (const m of twTheme.matchAll(
  /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+|none)\)/g,
)) {
  const [, fam, step, L, C, H] = m;
  (twFamilies[fam] ??= []).push({
    step: Number(step),
    L: round(Number(L) / 100),
    C: Number(C),
    H: H === "none" || Number(C) < 1e-4 ? null : Number(H),
  });
}
for (const fam of Object.values(twFamilies)) fam.sort((a, b) => a.step - b.step);

const twNeutralNames = ["slate", "gray", "zinc", "neutral", "stone"];
const twNeutrals = {};
for (const fam of twNeutralNames) {
  const steps = twFamilies[fam];
  const Cs = steps.map((s) => s.C);
  const peakIdx = Cs.indexOf(Math.max(...Cs));
  twNeutrals[fam] = {
    steps,
    maxC: round(Math.max(...Cs)),
    peakStepName: steps[peakIdx].step,
    hue: hueStats(steps),
  };
}

// Tailwind neutral↔accent hue relations (hypothesized pairings by hue proximity)
const twPairings = {
  slate: ["blue", "indigo", "sky"],
  gray: ["blue", "indigo"],
  zinc: ["violet", "purple"],
  stone: ["orange", "amber", "yellow", "red"],
};
const twPairingAnalysis = {};
for (const [fam, accents] of Object.entries(twPairings)) {
  const grayHue = twNeutrals[fam].hue.mean;
  twPairingAnalysis[fam] = {
    grayHue,
    accents: accents.map((a) => {
      const steps = twFamilies[a];
      const h600 = steps.find((s) => s.step === 600).H; // tailwind solid convention
      const mean = hueStats(steps).mean;
      return {
        accent: a,
        accentH600: round(h600, 2),
        accentHMean: mean,
        offsetFromH600: hueDiff(grayHue, h600),
        offsetFromMean: hueDiff(grayHue, mean),
      };
    }),
  };
}

// ---------- Aggregates ----------
const tinted = ["mauve", "slate", "sage", "olive", "sand"];
let whisperCeiling = 0;
let ceilingAt = null;
for (const fam of tinted)
  for (const mode of ["light", "dark"]) {
    const { maxC, peakStep } = summaries[fam][mode];
    if (maxC > whisperCeiling) {
      whisperCeiling = maxC;
      ceilingAt = { family: fam, mode, step: peakStep };
    }
  }

// normalized C(step) curve, averaged over tinted families, per mode
const normCurve = {};
for (const mode of ["light", "dark"]) {
  const curves = tinted.map((fam) => {
    const Cs = summaries[fam][mode].C;
    const max = Math.max(...Cs);
    return Cs.map((c) => c / max);
  });
  normCurve[mode] = Array.from({ length: 12 }, (_, i) =>
    round(curves.reduce((s, c) => s + c[i], 0) / curves.length, 3),
  );
}

writeFileSync(
  join(dataDir, "radix-grays.json"),
  JSON.stringify(
    {
      note: "OKLCH via culori converter('oklch'); H null when C < 1e-4. Hue stats C-weighted circular mean over steps with C >= 0.002.",
      scales: radixGrays,
      summaries,
      pairingAnalysis,
    },
    null,
    2,
  ),
);

writeFileSync(
  join(dataDir, "neutral-tint-rule.json"),
  JSON.stringify(
    {
      note: "Aggregated D8 outputs: whisper ceiling, normalized C(step) tint curve, gray-hue-from-accent-hue rule, plus Tailwind v4 neutrals.",
      whisperCeiling: { maxC: whisperCeiling, at: ceilingAt },
      perFamilyMaxC: Object.fromEntries(
        tinted.map((f) => [
          f,
          { light: summaries[f].light.maxC, dark: summaries[f].dark.maxC },
        ]),
      ),
      pureGrayMaxC: { light: summaries.gray.light.maxC, dark: summaries.gray.dark.maxC },
      normalizedTintCurve: normCurve,
      peakSteps: Object.fromEntries(
        tinted.map((f) => [
          f,
          { light: summaries[f].light.peakStep, dark: summaries[f].dark.peakStep },
        ]),
      ),
      hueConstancy: Object.fromEntries(
        tinted.map((f) => [
          f,
          { light: summaries[f].light.hue, dark: summaries[f].dark.hue },
        ]),
      ),
      tailwind: { neutrals: twNeutrals, pairingAnalysis: twPairingAnalysis },
    },
    null,
    2,
  ),
);

console.log("whisper ceiling:", whisperCeiling, ceilingAt);
console.log("norm curve light:", normCurve.light.join(" "));
console.log("norm curve dark: ", normCurve.dark.join(" "));
for (const fam of tinted) {
  console.log(
    fam,
    "hueL",
    summaries[fam].light.hue,
    "hueD",
    summaries[fam].dark.hue,
    "maxC L/D",
    summaries[fam].light.maxC,
    summaries[fam].dark.maxC,
  );
}
