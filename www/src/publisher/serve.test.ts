import { expect, test } from "vitest"

import { resolveRequestPreset } from "@/lib/registry-preset"

import { publishItem } from "./serve"
import type { PublishItemInput } from "./serve"

test("concurrent requests keep their own dep origin and preset", async () => {
  const requests: PublishItemInput[] = [
    {
      name: "button",
      preset: { density: "compact", componentParams: {} },
      origin: "https://a.test",
      query: "preset=origin@1&d=v5.aaa",
    },
    {
      name: "button",
      preset: { density: "comfortable", componentParams: {} },
      origin: "https://b.test",
      query: "preset=linear@1",
    },
  ]
  const sequential = []
  for (const request of requests) sequential.push(await publishItem(request))

  const [a, b] = await Promise.all(requests.map(publishItem))

  expect(a?.registryDependencies).toEqual([
    "https://a.test/r/loader?preset=origin@1&d=v5.aaa",
  ])
  expect(b?.registryDependencies).toEqual([
    "https://b.test/r/loader?preset=linear@1",
  ])
  expect(a?.files?.[0]?.content).not.toBe(b?.files?.[0]?.content)
  expect([a, b]).toEqual(sequential)
})

test("a request without a preset pins Origin's latest revision on dep URLs", async () => {
  const resolved = await resolveRequestPreset(new URLSearchParams())
  if (!resolved.ok) throw new Error(resolved.reason)
  const item = await publishItem({
    name: "button",
    preset: resolved.preset,
    origin: "https://dotui.org",
    query: resolved.query,
  })
  expect(item?.registryDependencies).toEqual([
    "https://dotui.org/r/loader?preset=origin@1",
  ])
})
