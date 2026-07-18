// D5 fit: which shared curve family best reproduces Radix light chroma?
// Reads research/data/radix-light-chroma.json (run d5-chroma-measure.mjs first).
// Compares three models over the 22 vivid Radix families, in absolute-C units
// (at fixed L and H, a chroma residual IS the OKLab ΔE):
//   M_abs : C(s) = A(s)                      shared absolute table, 0 params/family
//   M_norm: C(s) = Cpeak_f * g(s)            shared shape, 1 param/family (peak C)
//   M_rel : C(s) = k(s) * CmaxSRGB(L_s, H_s) shared cusp-relative table, 0 params/family
// Then fits parametric forms: skew-Gaussian for g(s), cubic for k(s).
// Deterministic; run: node research/d5-chroma-fit.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const data = JSON.parse(
  readFileSync(
    new URL('./data/radix-light-chroma.json', import.meta.url),
    'utf8',
  ),
)
const round = (x, d = 4) => Number(x.toFixed(d))
const MUTED = new Set(['bronze', 'gold', 'brown'])
const vivid = data.radix.filter((f) => !MUTED.has(f.name))

const N = 12
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

// Shared per-step tables (least-squares optimum for each model form).
const A = [] // M_abs table
const g = [] // M_norm shape (LS: g(s) = sum(Cpeak*C) / sum(Cpeak^2))
const k = [] // M_rel table (LS over cmax weights)
for (let i = 0; i < N; i++) {
  A.push(mean(vivid.map((f) => f.steps[i].c)))
  const num = mean(vivid.map((f) => f.peakC * f.steps[i].c))
  const den = mean(vivid.map((f) => f.peakC ** 2))
  g.push(num / den)
  const numK = mean(vivid.map((f) => f.steps[i].cmaxAtLH * f.steps[i].c))
  const denK = mean(vivid.map((f) => f.steps[i].cmaxAtLH ** 2))
  k.push(numK / denK)
}

function evalModel(pred) {
  const perStep = []
  let all = []
  for (let i = 0; i < N; i++) {
    const res = vivid.map((f) => pred(f, i) - f.steps[i].c)
    all = all.concat(res)
    perStep.push({
      step: i + 1,
      rmse: round(Math.sqrt(mean(res.map((r) => r * r)))),
      maxAbs: round(Math.max(...res.map(Math.abs))),
    })
  }
  const rmse = Math.sqrt(mean(all.map((r) => r * r)))
  const worst = all.reduce((a, b) => (Math.abs(b) > Math.abs(a) ? b : a), 0)
  return { rmse: round(rmse), maxAbsResidual: round(Math.abs(worst)), perStep }
}

const mAbs = evalModel((f, i) => A[i])
const mNorm = evalModel((f, i) => f.peakC * g[i])
const mRel = evalModel((f, i) => k[i] * f.steps[i].cmaxAtLH)
// Hybrid: never exceed the family's cusp-relative ceiling budget, keep the
// peak-normalized shape — C(s) = min(Cpeak*g(s), k(s)*Cmax(L,H)).
const mHybrid = evalModel((f, i) =>
  Math.min(f.peakC * g[i], k[i] * f.steps[i].cmaxAtLH),
)

// ---------- parametric forms ----------
// g(s): skew-Gaussian  g(s) = amp * exp(-0.5*((s-mu)/sigma)^2), sigma = sL if s<mu else sR
function skewGauss(s, [amp, mu, sL, sR]) {
  const sig = s < mu ? sL : sR
  return amp * Math.exp(-0.5 * ((s - mu) / sig) ** 2)
}
let best = null
for (let mu = 8.0; mu <= 11.0; mu += 0.05) {
  for (let sL = 2.0; sL <= 6.0; sL += 0.05) {
    for (let sR = 1.0; sR <= 4.0; sR += 0.05) {
      // amp closed-form LS against vivid cNorm points
      let num = 0
      let den = 0
      for (const f of vivid)
        for (let i = 0; i < N; i++) {
          const b = skewGauss(i + 1, [1, mu, sL, sR])
          num += b * (f.steps[i].c / f.peakC)
          den += b * b
        }
      const amp = num / den
      let sse = 0
      for (const f of vivid)
        for (let i = 0; i < N; i++)
          sse +=
            (f.peakC * skewGauss(i + 1, [amp, mu, sL, sR]) - f.steps[i].c) ** 2
      if (!best || sse < best.sse) best = { sse, params: [amp, mu, sL, sR] }
    }
  }
}
const gFit = best.params.map((p) => round(p, 3))
const mNormParam = evalModel((f, i) => f.peakC * skewGauss(i + 1, best.params))

// k(s): cubic in t = (s-1)/11, LS over all vivid points weighted by cmax
function polyFit(xs, ys, deg) {
  // normal equations
  const n = deg + 1
  const M = Array.from({ length: n }, () => new Array(n + 1).fill(0))
  for (let p = 0; p < xs.length; p++) {
    const row = Array.from({ length: n }, (_, j) => xs[p] ** j)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) M[i][j] += row[i] * row[j]
      M[i][n] += row[i] * ys[p]
    }
  }
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++)
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    ;[M[col], M[piv]] = [M[piv], M[col]]
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const fct = M[r][col] / M[col][col]
      for (let cc = col; cc <= n; cc++) M[r][cc] -= fct * M[col][cc]
    }
  }
  return M.map((row, i) => row[n] / M[i][i])
}
const xsK = []
const ysK = []
for (const f of vivid)
  for (let i = 0; i < N; i++) {
    xsK.push(i / (N - 1))
    ysK.push(f.steps[i].cRel)
  }
const kCubic = polyFit(xsK, ysK, 3)
const kOf = (i) => kCubic.reduce((a, c, p) => a + c * (i / (N - 1)) ** p, 0)
const mRelParam = evalModel((f, i) => kOf(i) * f.steps[i].cmaxAtLH)

// ---------- Tailwind k(s) ----------
const twVivid = data.tailwind
const NT = 11
const xsT = []
const ysT = []
for (const f of twVivid)
  for (let i = 0; i < NT; i++) {
    xsT.push(i / (NT - 1))
    ysT.push(f.steps[i].cRel)
  }
const twQuad = polyFit(xsT, ysT, 2)
const twKOf = (i) => twQuad.reduce((a, c, p) => a + c * (i / (NT - 1)) ** p, 0)
let twAll = []
for (const f of twVivid)
  for (let i = 0; i < NT; i++)
    twAll.push(twKOf(i) * f.steps[i].cmaxAtLH - f.steps[i].c)
const twRmse = Math.sqrt(mean(twAll.map((r) => r * r)))
const twMax = Math.max(...twAll.map(Math.abs))

// ---------- solids vs cusp summaries ----------
function solidSummary(fams, idx) {
  const dL = fams.map((f) => f.steps[idx].l - f.cusp.l)
  const cOver = fams.map((f) => f.steps[idx].c / f.cusp.c)
  const rel = fams.map((f) => f.steps[idx].cRel)
  const s = (arr) => ({
    mean: round(mean(arr)),
    min: round(Math.min(...arr)),
    max: round(Math.max(...arr)),
  })
  return { dLfromCusp: s(dL), cOverCuspC: s(cOver), cRelAtOwnL: s(rel) }
}

// Worst residuals of the winning model (peak-scaled table) for honesty.
const worstList = []
for (const f of vivid)
  for (let i = 0; i < N; i++)
    worstList.push({
      family: f.name,
      step: i + 1,
      residual: round(f.peakC * g[i] - f.steps[i].c),
    })
worstList.sort((a, b) => Math.abs(b.residual) - Math.abs(a.residual))

// How peak chroma relates to the family cusp (locks the vividness default).
const peakOverCusp = vivid.map((f) => f.peakC / f.cusp.c)
const peakStepCount = {}
for (const f of vivid)
  peakStepCount[f.peakStep] = (peakStepCount[f.peakStep] ?? 0) + 1

const out = {
  meta: {
    generated: 'd5-chroma-fit.mjs',
    families: {
      radixVivid: vivid.map((f) => f.name),
      excludedMuted: [...MUTED],
    },
    residualUnits:
      'absolute OKLCH chroma; at fixed L,H this equals OKLab deltaE of the chroma error',
  },
  sharedTables: {
    steps: Array.from({ length: N }, (_, i) => i + 1),
    absC_A: A.map((v) => round(v)),
    peakNorm_g: g.map((v) => round(v)),
    cuspRel_k: k.map((v) => round(v)),
  },
  models: {
    M_abs_sharedAbsoluteC: mAbs,
    M_norm_peakScaledShape: mNorm,
    M_rel_cuspRelative: mRel,
    M_hybrid_minOfNormAndRel: mHybrid,
  },
  parametric: {
    gSkewGaussian: {
      form: 'g(s) = amp * exp(-0.5*((s-mu)/sigma)^2), sigma = sigmaL if s<mu else sigmaR',
      params: { amp: gFit[0], mu: gFit[1], sigmaL: gFit[2], sigmaR: gFit[3] },
      fit: { rmse: mNormParam.rmse, maxAbsResidual: mNormParam.maxAbsResidual },
    },
    kCubic: {
      form: 'k(t) = c0 + c1*t + c2*t^2 + c3*t^3, t=(step-1)/11',
      params: kCubic.map((c) => round(c, 4)),
      table: Array.from({ length: N }, (_, i) => round(kOf(i))),
      fit: { rmse: mRelParam.rmse, maxAbsResidual: mRelParam.maxAbsResidual },
    },
    tailwindKQuadratic: {
      form: 'k(t) = c0 + c1*t + c2*t^2, t=(idx-1)/10, idx over 50..950',
      params: twQuad.map((c) => round(c, 4)),
      table: Array.from({ length: NT }, (_, i) => round(twKOf(i))),
      fit: { rmse: round(twRmse), maxAbsResidual: round(twMax) },
      note: 'Tailwind v4 literals exceed sRGB (P3-target); k is measured against the sRGB ceiling',
    },
  },
  winnerDiagnostics: {
    worstResiduals: worstList.slice(0, 8),
    peakStepHistogram: peakStepCount,
    peakCOverCuspC: {
      mean: round(mean(peakOverCusp)),
      min: round(Math.min(...peakOverCusp)),
      max: round(Math.max(...peakOverCusp)),
    },
  },
  solids: {
    radixStep9: solidSummary(vivid, 8),
    radixStep10: solidSummary(vivid, 9),
    tailwind500: solidSummary(twVivid, 5),
    tailwind600: solidSummary(twVivid, 6),
  },
}

writeFileSync(
  new URL('./data/chroma-curve-fit.json', import.meta.url),
  JSON.stringify(out, null, 2),
)

console.log('Model comparison (Radix vivid, absolute-C residuals):')
for (const [name, m] of Object.entries(out.models))
  console.log(`  ${name.padEnd(28)} rmse=${m.rmse} max=${m.maxAbsResidual}`)
console.log('\nShared tables:')
console.log('  A(s)  =', out.sharedTables.absC_A.join(', '))
console.log('  g(s)  =', out.sharedTables.peakNorm_g.join(', '))
console.log('  k(s)  =', out.sharedTables.cuspRel_k.join(', '))
console.log(
  '\ng skew-Gaussian:',
  out.parametric.gSkewGaussian.params,
  out.parametric.gSkewGaussian.fit,
)
console.log('k cubic:', out.parametric.kCubic.params, out.parametric.kCubic.fit)
console.log('k cubic table:', out.parametric.kCubic.table.join(', '))
console.log(
  'TW k quadratic:',
  out.parametric.tailwindKQuadratic.params,
  out.parametric.tailwindKQuadratic.fit,
)
console.log('TW k table:', out.parametric.tailwindKQuadratic.table.join(', '))
console.log(
  '\nWinner worst residuals:',
  JSON.stringify(out.winnerDiagnostics.worstResiduals),
)
console.log('Peak-step histogram:', out.winnerDiagnostics.peakStepHistogram)
console.log('peakC / cuspC:', out.winnerDiagnostics.peakCOverCuspC)
console.log('\nSolids vs cusp:', JSON.stringify(out.solids, null, 1))
