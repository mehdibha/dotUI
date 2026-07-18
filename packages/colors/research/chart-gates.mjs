// D11 — chart palette gates: reference measurements + proposed numeric gates.
//
// Measures Okabe-Ito and matplotlib tab10 (categorical references) and viridis
// (sequential reference) to derive:
//   - min pairwise ΔEok gates (normal vision + protan/deutan/tritan severity 1.0)
//   - the L* stagger rule for categorical palettes
//   - the sequential L* monotonicity tolerance
// then sanity-tests dotUI's current chart choice (status 500s) against them.
//
// Conventions: ΔEok = Euclidean distance in OKLab (raw 0..~1 scale, NOT ×100).
// L* = CIELAB lightness with D65 white (culori `lab65`), matching the D3 bridge.
// CVD simulation: culori Machado filters at severity 1.0.
//
// Run: node research/chart-gates.mjs   (from packages/colors)

import {
  converter,
  differenceEuclidean,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  formatHex,
  parse,
} from "culori";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "data");
mkdirSync(dataDir, { recursive: true });

const toOklab = converter("oklab");
const toLab65 = converter("lab65");
const deltaEok = differenceEuclidean("oklab");
const round = (x, d = 4) => Number(x.toFixed(d));

// ---------------------------------------------------------------------------
// Reference palettes
// ---------------------------------------------------------------------------

// Okabe & Ito (2008), "Color Universal Design" — the canonical CVD-safe set.
const okabeIto = [
  ["black", "#000000"],
  ["orange", "#e69f00"],
  ["skyBlue", "#56b4e9"],
  ["bluishGreen", "#009e73"],
  ["yellow", "#f0e442"],
  ["blue", "#0072b2"],
  ["vermillion", "#d55e00"],
  ["reddishPurple", "#cc79a7"],
];

// matplotlib tab10 (= d3 schemeCategory10).
const tab10 = [
  ["blue", "#1f77b4"],
  ["orange", "#ff7f0e"],
  ["green", "#2ca02c"],
  ["red", "#d62728"],
  ["purple", "#9467bd"],
  ["brown", "#8c564b"],
  ["pink", "#e377c2"],
  ["gray", "#7f7f7f"],
  ["olive", "#bcbd22"],
  ["cyan", "#17becf"],
];

// dotUI's current de-facto chart palette: the five status 500s from
// www/src/registry/base/colors.css (identical in light and dark blocks).
const dotuiCurrent = [
  ["accent-500", "oklch(0.6478 0.1337 251.06)"],
  ["success-500", "oklch(0.6512 0.1869 148.33)"],
  ["warning-500", "oklch(0.6497 0.1338 82.26)"],
  ["danger-500", "oklch(0.6478 0.2078 25.33)"],
  ["info-500", "oklch(0.6478 0.188 259.81)"],
];

// viridis, 256 entries — d3-scale-chromatic v3.1.0 ramp string (itself derived
// from matplotlib's published table). Validated below against known anchors.
const VIRIDIS_RAMP =
  "44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725";

function viridisTable() {
  if (VIRIDIS_RAMP.length !== 1536) {
    throw new Error(`viridis ramp length ${VIRIDIS_RAMP.length}, expected 1536`);
  }
  if (!/^[0-9a-f]+$/.test(VIRIDIS_RAMP)) throw new Error("non-hex chars in viridis ramp");
  const colors = [];
  for (let i = 0; i < 256; i++) colors.push("#" + VIRIDIS_RAMP.slice(i * 6, i * 6 + 6));
  // Anchor validation: endpoints + well-published mid anchors must sit at
  // 6-aligned offsets (catches truncation/transposition in the ramp string).
  const anchors = [
    [0, "#440154"],
    [255, "#fde725"],
  ];
  for (const [idx, hex] of anchors) {
    if (colors[idx] !== hex) throw new Error(`viridis[${idx}] = ${colors[idx]}, expected ${hex}`);
  }
  for (const known of ["31688e", "35b779"]) {
    const at = VIRIDIS_RAMP.indexOf(known);
    if (at < 0 || at % 6 !== 0) throw new Error(`viridis anchor ${known} misaligned (at ${at})`);
  }
  // Cross-check widely published quartile values (allow small table quantization).
  const quartiles = [
    [Math.round(0.25 * 255), "#3b528b"],
    [Math.round(0.5 * 255), "#21918c"],
    [Math.round(0.75 * 255), "#5ec962"],
  ];
  for (const [idx, hex] of quartiles) {
    const d = deltaEok(colors[idx], hex);
    if (d > 0.02) throw new Error(`viridis[${idx}] = ${colors[idx]} too far from ${hex} (ΔEok ${d})`);
  }
  return colors;
}

// ---------------------------------------------------------------------------
// Measurement helpers
// ---------------------------------------------------------------------------

const cvdFilters = {
  protan: filterDeficiencyProt(1),
  deutan: filterDeficiencyDeuter(1),
  tritan: filterDeficiencyTrit(1),
};

function minPairwise(colors, names) {
  let min = Infinity;
  let pair = null;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const d = deltaEok(colors[i], colors[j]);
      if (d < min) {
        min = d;
        pair = [names[i], names[j]];
      }
    }
  }
  return { min: round(min), pair };
}

function measureCategorical(entries) {
  const names = entries.map(([n]) => n);
  const parsed = entries.map(([, c]) => parse(c));
  const result = {
    colors: entries.map(([name, css]) => {
      const lab = toLab65(css);
      const ok = toOklab(css);
      return {
        name,
        css,
        hex: formatHex(css),
        lStar: round(lab.l, 2),
        oklab: { l: round(ok.l), a: round(ok.a), b: round(ok.b) },
      };
    }),
    minPairwiseDeltaEok: { normal: minPairwise(parsed, names) },
    lStar: {},
  };
  for (const [cvd, filter] of Object.entries(cvdFilters)) {
    result.minPairwiseDeltaEok[cvd] = minPairwise(parsed.map((c) => filter(c)), names);
  }

  // L* geometry: overall spread, min gap between L*-sorted neighbors, and min
  // gap between palette-order neighbors (series are assigned in order).
  const ls = result.colors.map((c) => c.lStar);
  const sorted = [...ls].sort((a, b) => a - b);
  const sortedGaps = sorted.slice(1).map((l, i) => round(l - sorted[i], 2));
  const orderGaps = ls.slice(1).map((l, i) => round(Math.abs(l - ls[i]), 2));
  result.lStar = {
    values: ls,
    range: round(sorted[sorted.length - 1] - sorted[0], 2),
    minSortedGap: Math.min(...sortedGaps),
    sortedGaps,
    minAdjacentInOrderGap: Math.min(...orderGaps),
    adjacentInOrderGaps: orderGaps,
  };
  return result;
}

function sampleViridis(table, n) {
  const stops = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const idx = Math.round(t * 255);
    const hex = table[idx];
    return { t: round(t, 4), index: idx, hex, lStar: round(toLab65(hex).l, 2) };
  });
  const deltas = stops.slice(1).map((s, i) => ({
    from: stops[i].hex,
    to: s.hex,
    deltaLstar: round(s.lStar - stops[i].lStar, 2),
    deltaEok: round(deltaEok(stops[i].hex, s.hex)),
  }));
  const dLs = deltas.map((d) => d.deltaLstar);
  const ideal = (stops[n - 1].lStar - stops[0].lStar) / (n - 1);
  return {
    n,
    stops,
    adjacent: deltas,
    lStarStrictlyMonotonic: dLs.every((d) => d > 0),
    minDeltaLstar: Math.min(...dLs),
    maxDeltaLstar: Math.max(...dLs),
    idealEqualDeltaLstar: round(ideal, 2),
    minToIdealRatio: round(Math.min(...dLs) / ideal, 3),
    minAdjacentDeltaEok: Math.min(...deltas.map((d) => d.deltaEok)),
  };
}

// ---------------------------------------------------------------------------
// Run measurements
// ---------------------------------------------------------------------------

const table = viridisTable();

const okabe = measureCategorical(okabeIto);
const okabeNoBlack = measureCategorical(okabeIto.filter(([n]) => n !== "black"));
const tab = measureCategorical(tab10);
const dotui = measureCategorical(dotuiCurrent);

const viridis5 = sampleViridis(table, 5);
const viridis8 = sampleViridis(table, 8);

// Full-table monotonicity (quantization wiggles allowed, report them).
const fullL = table.map((hex) => toLab65(hex).l);
let nonMonotonic = 0;
let worstWiggle = 0;
for (let i = 1; i < fullL.length; i++) {
  const d = fullL[i] - fullL[i - 1];
  if (d <= 0) {
    nonMonotonic++;
    worstWiggle = Math.min(worstWiggle, d);
  }
}

const referenceFixture = {
  meta: {
    decision: "D11",
    generatedBy: "research/chart-gates.mjs",
    deltaEok: "Euclidean distance in OKLab (raw scale, not ×100)",
    lStar: "CIELAB L* with D65 white point (culori lab65)",
    cvd: "culori Machado filters, severity 1.0",
    viridisSource: "d3-scale-chromatic@3.1.0 ramp (256 entries, from matplotlib's table)",
  },
  okabeIto8: okabe,
  okabeIto7noBlack: okabeNoBlack,
  tab10: tab,
  viridis: {
    fullTable: {
      entries: 256,
      lStarNonMonotonicSteps: nonMonotonic,
      worstNegativeDeltaLstar: round(worstWiggle, 4),
      lStarStart: round(fullL[0], 2),
      lStarEnd: round(fullL[255], 2),
    },
    sampled5: viridis5,
    sampled8: viridis8,
  },
};

writeFileSync(
  join(dataDir, "chart-reference-palettes.json"),
  JSON.stringify(referenceFixture, null, 2) + "\n",
);

// ---------------------------------------------------------------------------
// Propose gates from the measurements, then test dotUI's current palette
// ---------------------------------------------------------------------------

// Gate rationale (numbers pulled from the measurements just made):
// - normal-vision separation: tab10 is the everyday-charting reference (min
//   pairwise ΔEok 0.1133); gate a bit under it so equally-good palettes pass.
// - CVD separation: tab10 fails protan (orange/green ΔEok 0.0146), so the CVD
//   bar comes from Okabe-Ito — the designed-for-CVD reference, whose worst
//   min across the three deficiencies is 0.0862 (protan) — gated at ~half.
// - L* stagger: measured references do NOT keep in-order neighbors apart in
//   L* (Okabe-Ito worst adjacent gap 0.78, tab10 3.79), so a hard adjacent
//   gate would reject both. The enforceable gate is overall L* range (tab10
//   31.95, Okabe-Ito-no-black 43.14 → gate 25); adjacent-in-order ΔL* ≥ 8 is
//   a generation-side target our generator can satisfy because it controls
//   series order — advisory, not a CI failure.
// - sequential: viridis is strictly monotonic with near-equal steps (min/ideal
//   0.937–0.949); require strict monotonicity plus a loose per-step floor of
//   0.5 × ideal equal spacing to reject plateaus without demanding viridis-
//   grade uniformity.
const normalRef = Math.min(tab.minPairwiseDeltaEok.normal.min, okabe.minPairwiseDeltaEok.normal.min);
const cvdRef = Math.min(
  okabe.minPairwiseDeltaEok.protan.min,
  okabe.minPairwiseDeltaEok.deutan.min,
  okabe.minPairwiseDeltaEok.tritan.min,
);

const gates = {
  categorical: {
    appliesTo: "palette sizes 5–8",
    minPairwiseDeltaEokNormal: 0.09,
    minPairwiseDeltaEokCvd: 0.045,
    cvdConditions: "each of protan, deutan, tritan at severity 1.0",
    lStar: {
      ciGate: { minLstarRange: 25 },
      generationRule: {
        advisory: true,
        minAdjacentInOrderDeltaLstar: 8,
        note: "target when ordering generated series; references violate it, so not a CI failure",
      },
    },
    derivedFrom: {
      normalVisionReferenceMin: normalRef,
      okabeItoWorstCvdMin: cvdRef,
      tab10ProtanMin: tab.minPairwiseDeltaEok.protan.min,
      referenceLstarRanges: { tab10: tab.lStar.range, okabeIto7noBlack: okabeNoBlack.lStar.range },
      referenceWorstAdjacentInOrderLstarGap: Math.min(
        tab.lStar.minAdjacentInOrderGap,
        okabe.lStar.minAdjacentInOrderGap,
      ),
    },
  },
  sequential: {
    rule: "L* strictly monotonic; every adjacent ΔL* ≥ 0.5 × ideal equal spacing",
    lStarStrictlyMonotonic: true,
    minStepToIdealRatio: 0.5,
    minAdjacentDeltaEok: 0.02,
    derivedFrom: {
      viridis5minToIdealRatio: viridis5.minToIdealRatio,
      viridis8minToIdealRatio: viridis8.minToIdealRatio,
      viridis8minAdjacentDeltaEok: viridis8.minAdjacentDeltaEok,
    },
  },
  diverging: {
    rule: "each arm passes the sequential gate; midpoint pinned to surface neutral (D11 spec)",
  },
};

function testCategorical(m, g) {
  const failures = [];
  const checks = {
    normalDeltaEok: {
      measured: m.minPairwiseDeltaEok.normal.min,
      required: g.minPairwiseDeltaEokNormal,
      worstPair: m.minPairwiseDeltaEok.normal.pair,
      pass: m.minPairwiseDeltaEok.normal.min >= g.minPairwiseDeltaEokNormal,
    },
  };
  for (const cvd of ["protan", "deutan", "tritan"]) {
    checks[`${cvd}DeltaEok`] = {
      measured: m.minPairwiseDeltaEok[cvd].min,
      required: g.minPairwiseDeltaEokCvd,
      worstPair: m.minPairwiseDeltaEok[cvd].pair,
      pass: m.minPairwiseDeltaEok[cvd].min >= g.minPairwiseDeltaEokCvd,
    };
  }
  checks.lStarRange = {
    measured: m.lStar.range,
    required: g.lStar.ciGate.minLstarRange,
    pass: m.lStar.range >= g.lStar.ciGate.minLstarRange,
  };
  checks.lStarAdjacentStagger = {
    advisory: true,
    measured: m.lStar.minAdjacentInOrderGap,
    target: g.lStar.generationRule.minAdjacentInOrderDeltaLstar,
    pass: m.lStar.minAdjacentInOrderGap >= g.lStar.generationRule.minAdjacentInOrderDeltaLstar,
  };
  for (const [name, c] of Object.entries(checks)) {
    if (!c.pass) (c.advisory ? [] : failures).push(name);
  }
  const advisoryMisses = Object.entries(checks)
    .filter(([, c]) => c.advisory && !c.pass)
    .map(([name]) => name);
  return { checks, failures, advisoryMisses, pass: failures.length === 0 };
}

const gatesFixture = {
  meta: referenceFixture.meta,
  gates,
  referencePalettesAgainstGates: {
    okabeIto8: testCategorical(okabe, gates.categorical),
    tab10: testCategorical(tab, gates.categorical),
  },
  dotuiCurrentStatus500s: {
    source: "www/src/registry/base/colors.css (accent/success/warning/danger/info 500)",
    measurements: dotui,
    againstGates: testCategorical(dotui, gates.categorical),
  },
};

writeFileSync(join(dataDir, "chart-gates.json"), JSON.stringify(gatesFixture, null, 2) + "\n");

// ---------------------------------------------------------------------------
// Console summary
// ---------------------------------------------------------------------------

const show = (label, m) => {
  const d = m.minPairwiseDeltaEok;
  console.log(
    `${label}: normal ${d.normal.min} (${d.normal.pair.join("/")}) | protan ${d.protan.min} (${d.protan.pair.join("/")}) | deutan ${d.deutan.min} (${d.deutan.pair.join("/")}) | tritan ${d.tritan.min} (${d.tritan.pair.join("/")})`,
  );
  console.log(
    `  L*: range ${m.lStar.range}, min sorted gap ${m.lStar.minSortedGap}, min adjacent-in-order gap ${m.lStar.minAdjacentInOrderGap}`,
  );
  console.log(`  L* values: ${m.lStar.values.join(", ")}`);
};

show("Okabe-Ito 8", okabe);
show("Okabe-Ito 7 (no black)", okabeNoBlack);
show("tab10", tab);
show("dotUI status-500s", dotui);
for (const v of [viridis5, viridis8]) {
  console.log(
    `viridis n=${v.n}: L* ${v.stops.map((s) => s.lStar).join(" → ")} | monotonic ${v.lStarStrictlyMonotonic} | ΔL* min ${v.minDeltaLstar} max ${v.maxDeltaLstar} ideal ${v.idealEqualDeltaLstar} (min/ideal ${v.minToIdealRatio}) | min adj ΔEok ${v.minAdjacentDeltaEok}`,
  );
}
console.log(
  `viridis full table: ${nonMonotonic} non-monotonic steps, worst ΔL* ${round(worstWiggle, 4)}`,
);
console.log("dotUI failures:", gatesFixture.dotuiCurrentStatus500s.againstGates.failures.join(", "));
console.log("okabeIto8 vs gates:", gatesFixture.referencePalettesAgainstGates.okabeIto8.failures);
console.log("tab10 vs gates:", gatesFixture.referencePalettesAgainstGates.tab10.failures);
