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
      encodedPreset: "aaa",
    },
    {
      name: "button",
      preset: { density: "comfortable", componentParams: {} },
      origin: "https://b.test",
      encodedPreset: "bbb",
    },
  ]
  const sequential = []
  for (const request of requests) sequential.push(await publishItem(request))

  const [a, b] = await Promise.all(requests.map(publishItem))

  expect(a?.registryDependencies).toEqual([
    "https://a.test/r/loader?preset=aaa",
  ])
  expect(b?.registryDependencies).toEqual([
    "https://b.test/r/loader?preset=bbb",
  ])
  expect(a?.files?.[0]?.content).not.toBe(b?.files?.[0]?.content)
  expect([a, b]).toEqual(sequential)
})

test("a request without a preset emits dep URLs without a query", async () => {
  const resolved = await resolveRequestPreset(undefined)
  if (!resolved.ok) throw new Error(resolved.reason)
  const item = await publishItem({
    name: "button",
    preset: resolved.preset,
    origin: "https://dotui.org",
  })
  expect(item?.registryDependencies).toEqual(["https://dotui.org/r/loader"])
})
