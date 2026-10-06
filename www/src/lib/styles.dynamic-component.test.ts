// Compile-time cases: each `@ts-expect-error` must fail to compile (`pnpm typecheck`).
import { expect, test } from "vitest"

import type { RegistryItem } from "@/registry/types"

import { createDynamicComponent } from "./styles"

const meta = {
  name: "fixture",
  type: "registry:ui",
  files: [{ type: "registry:ui", path: "fake.tsx", target: "fake.tsx" }],
  params: {
    mobile: {
      kind: "enum",
      default: "drawer",
      values: ["drawer", "anchored"] as const,
    },
  },
} satisfies RegistryItem

const Drawer = (_: { label: string }) => null
const Anchored = (_: { label: string }) => null

test("keys follow the param's values", () => {
  const Fixture = createDynamicComponent({
    meta,
    paramName: "mobile",
    components: { drawer: Drawer, anchored: Anchored },
  })
  expect(Fixture.displayName).toBe("Dynamic(fixture.mobile)")
})

// Never called: these only have to fail to compile.
export function wrongKeys() {
  createDynamicComponent({
    meta,
    paramName: "mobile",
    // @ts-expect-error a stale value name is not a key
    components: { drawer: Drawer, popover: Anchored },
  })

  createDynamicComponent({
    meta,
    paramName: "mobile",
    // @ts-expect-error every value needs a component
    components: { drawer: Drawer },
  })

  createDynamicComponent({
    meta,
    // @ts-expect-error the param must exist
    paramName: "style",
    components: { drawer: Drawer, anchored: Anchored },
  })
}
