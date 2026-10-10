import { renderToString } from "react-dom/server"
import { expect, test } from "vitest"

import type { RegistryItem } from "@/registry/types"

import {
  ComponentParamsProvider,
  createStyles,
  DesignSystemProvider,
  useComponentParams,
} from "./styles"

const meta = {
  name: "fixture",
  type: "registry:ui",
  files: [{ type: "registry:ui", path: "fake.tsx", target: "fake.tsx" }],
  params: {
    tone: {
      kind: "enum",
      default: "plain",
      values: ["plain", "loud"] as const,
    },
  },
} satisfies RegistryItem

const { useStyles } = createStyles(meta, {
  base: { base: "base" },
  density: {
    compact: { base: "compact" },
    default: {},
    comfortable: { base: "comfortable" },
  },
  params: { tone: { plain: { base: "plain" }, loud: { base: "loud" } } },
})

function Fixture() {
  return <i className={useStyles()()} />
}

function Param({ name }: { name: string }) {
  return <b>{useComponentParams(name).value ?? "none"}</b>
}

test("reads the nearest provider's selection and density", () => {
  expect(renderToString(<Fixture />)).toBe('<i class="base plain"></i>')
  expect(
    renderToString(
      <DesignSystemProvider
        params={{ fixture: { tone: "loud" } }}
        density="compact"
      >
        <Fixture />
      </DesignSystemProvider>,
    ),
  ).toBe('<i class="base compact loud"></i>')
  expect(
    renderToString(
      <ComponentParamsProvider params={{ fixture: { tone: "loud" } }}>
        <ComponentParamsProvider>
          <Fixture />
        </ComponentParamsProvider>
      </ComponentParamsProvider>,
    ),
  ).toBe('<i class="base plain"></i>')
})

test("names past the last slot still read their selection", () => {
  const params: Record<string, Record<string, string>> = {}
  for (let i = 0; i < 64; i++) params[`filler-${i}`] = { value: String(i) }
  params.late = { value: "late" }
  expect(
    renderToString(
      <ComponentParamsProvider params={params}>
        <Param name="filler-3" />
        <Param name="late" />
        <Param name="unknown" />
        <Fixture />
      </ComponentParamsProvider>,
    ),
  ).toBe("<b>3</b><b>late</b><b>none</b>" + '<i class="base plain"></i>')
})
