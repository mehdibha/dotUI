import { expect, test } from "vitest"

import { mixOklab, toOklch } from "./index"
import { toOklab } from "./space"

test("mixOklab interpolates in OKLab with weight as percent of the first stop", () => {
  const a = toOklch("oklch(0.2 0.02 250)")
  const b = toOklch("oklch(0.9 0.01 250)")
  expect(toOklab(mixOklab(a, 100, b)).l).toBeCloseTo(toOklab(a).l, 6)
  expect(toOklab(mixOklab(a, 0, b)).l).toBeCloseTo(toOklab(b).l, 6)
  const mid = toOklab(mixOklab(a, 50, b))
  expect(mid.l).toBeCloseTo((toOklab(a).l + toOklab(b).l) / 2, 6)
  expect(mid.a).toBeCloseTo((toOklab(a).a + toOklab(b).a) / 2, 6)
})
