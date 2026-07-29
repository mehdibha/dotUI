import { LED_COUNT, WAVE_AMP, WAVE_BASE, WAVE_COUNT } from './strip'

/**
 * Backlit pill — an LED strip runs behind the perimeter of the CTA pill, and a
 * bright cluster travels around that strip. Everything visible is the strip's
 * spill: the pill area itself is cut out (the real DOM pill sits on top), and
 * the light grazing past its edges leaves the rim.
 *
 * Each emitter radiates Lambertian about its outward normal. That single fact
 * also settles visibility exactly, with no ray casting: the pill is convex, so
 * `cos θ > 0` *is* the occlusion test — points behind the panel are unlit
 * because the emitters facing them are on the far side.
 *
 * The uniform packs position in `xy` and outward-normal × quadrature-weight ×
 * brightness in `zw`. With Lambertian falloff the weight cancels against the
 * `1/r` of the cosine, so one dot product yields cosine, weight and brightness
 * together and the inner loop stays about ten operations.
 *
 * Unlike the internal triangle demo this renders premultiplied transparency —
 * `tint × l` over alpha `l` — so the field composites as a screen-like wash
 * over whatever the page background is, light or dark.
 */
export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  uResolution;
uniform float uSeed;
uniform vec3  uTint;
// xy = pill centre (shader space), z = half the flat length, w = cap radius.
uniform vec4  uPanel;
// Cluster position along the perimeter, normalised [0, 1).
uniform float uCluster;
// Hover blend [0, 1] toward the whole-rim wave, and the wave phase in laps.
uniform float uHover;
uniform float uPhase;
uniform vec4  uLed[${LED_COUNT}];

// The rim is analytic (distance to the stadium border), so it stays perfectly
// continuous at any tightness; the emitter loop only builds the wide halo,
// whose per-emitter lobes are far broader than the emitter spacing.
// TIGHT_SCALE maps the analytic rim (peak ~1) onto the loop's
// weighted-average range so the two gains stay comparable.
const float TIGHT_R = 0.06;
const float TIGHT_G = 0.2;
const float TIGHT_SCALE = 0.006;
const float WIDE_R  = 1.2;
const float WIDE_G  = 0.005;

// Emitter weights are normalised to sum to 1, so the accumulation is a
// weighted average of the strip; EXPOSURE lifts it back to display range.
const float EXPOSURE = 150.0;
const float GAMMA    = 1.15;
const float GRAIN    = 0.035;

// 2σ² of the travelling-cluster envelope, σ = 0.18 of the perimeter — keep in
// sync with ENVELOPE_SIGMA in strip.ts.
const float ENV_2SIGMA2 = 0.0648;

// Stadium (capsule) signed distance, negative inside the pill.
float panel(vec2 p) {
  vec2 q = p - uPanel.xy;
  q.x -= clamp(q.x, -uPanel.z, uPanel.z);
  return length(q) - uPanel.w;
}

// Interleaved gradient noise — fine, well-distributed film grain.
float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)) - 0.5;
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

  float wide = 0.0;
  for (int i = 0; i < ${LED_COUNT}; i++) {
    vec2 d = p - uLed[i].xy;
    float r2 = dot(d, d);
    float rr = max(sqrt(r2), 1e-5);
    float c = dot(d, uLed[i].zw) / rr;
    if (c <= 0.0) continue;
    // Static per-emitter character: reach and strength vary bulb to bulb, so
    // the spill reads as many lights of different sizes. The strength
    // variance is gated on distance — near the rim every emitter contributes
    // evenly, the character emerges in the tail where the lobes overlap
    // softly.
    float h = hash1(float(i) * 12.9898);
    float rw = WIDE_R * (0.6975 + 0.605 * h);
    float g = mix(1.0, mix(0.505, 1.495, h * h), smoothstep(0.1, 0.35, rr));
    wide += c * g / (1.0 + r2 / (rw * rw));
  }

  // Analytic rim: exact distance to the stadium border plus exact position
  // along its perimeter (same walk as the strip: top-left junction, clockwise)
  // evaluated against the same travelling-cluster envelope as strip.ts. Being
  // closed-form it cannot bead, however tight the lobe.
  float sd = panel(p);
  vec2 q = p - uPanel.xy;
  float hf = uPanel.z;
  float rad = uPanel.w;
  float per = 4.0 * hf + ${2 * Math.PI} * rad;
  float s;
  if (abs(q.x) <= hf) {
    s = q.y > 0.0
      ? hf + q.x
      : 2.0 * hf + ${Math.PI} * rad + (hf - q.x);
  } else if (q.x > hf) {
    s = 2.0 * hf + atan(q.x - hf, q.y) * rad;
  } else {
    s = 4.0 * hf + ${Math.PI} * rad + atan(-hf - q.x, -q.y) * rad;
  }
  float dsc = abs(s / per - uCluster);
  dsc = min(dsc, 1.0 - dsc);
  float bump = exp(-dsc * dsc / ENV_2SIGMA2);
  float wave = ${WAVE_BASE} +
    ${WAVE_AMP} * cos(${2 * Math.PI} * (s / per * float(${WAVE_COUNT}) - uPhase));
  float env = 0.1 + mix(bump, wave, uHover);
  float tight = env / (1.0 + sd * sd / (TIGHT_R * TIGHT_R));

  float v = TIGHT_G * TIGHT_SCALE * tight + WIDE_G * wide;

  // Pill silhouette, antialiased over roughly one pixel.
  v *= smoothstep(0.0, 1.5 / uResolution.y, sd);

  // Fade with distance from the pill itself — an even, shape-following easing
  // from the border out to just inside the nearest canvas edge, rather than a
  // rectangular vignette that lets the halo hit a visible band and die.
  float w2 = 0.5 * uResolution.x / uResolution.y;
  float fadeEnd = 0.98 * min(
    w2 - abs(uPanel.x) - hf - rad,
    0.5 - abs(uPanel.y) - rad
  );
  v *= 1.0 - smoothstep(0.0, fadeEnd, sd);

  float l = pow(1.0 - exp(-max(v, 0.0) * EXPOSURE), 1.0 / GAMMA);
  l += ign(gl_FragCoord.xy + uSeed) * GRAIN * (0.18 + sqrt(max(l, 0.0)));
  l = clamp(l, 0.0, 1.0);

  fragColor = vec4(uTint * l, l);
}
`

// Full-viewport triangle from gl_VertexID alone — no vertex buffer needed.
export const VERTEX_SHADER = /* glsl */ `#version 300 es
void main() {
  vec2 v = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}
`
