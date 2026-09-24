import { expect, test } from "vitest"

import { publishItem } from "./serve"
import type { PublishItemInput } from "./serve"

const DEFAULT = { density: "default", componentParams: {} } as const

test("concurrent requests keep their own dep URLs and preset", async () => {
  const requests: PublishItemInput[] = [
    {
      name: "button",
      preset: { density: "compact", componentParams: {} },
      itemUrl: (name) => `https://a.test/r/p/linear/${name}.json`,
    },
    {
      name: "button",
      preset: { density: "comfortable", componentParams: {} },
      itemUrl: (name) => `https://b.test/r/s/0123456789/${name}.json`,
    },
  ]
  const sequential = []
  for (const request of requests) sequential.push(await publishItem(request))

  const [a, b] = await Promise.all(requests.map(publishItem))

  expect(a?.registryDependencies).toEqual([
    "https://a.test/r/p/linear/loader.json",
  ])
  expect(b?.registryDependencies).toEqual([
    "https://b.test/r/s/0123456789/loader.json",
  ])
  expect(a?.files?.[0]?.content).not.toBe(b?.files?.[0]?.content)
  expect([a, b]).toEqual(sequential)
})

test("names outside the publishables are not items", async () => {
  for (const name of ["nope", "constructor", "__proto__", "toString"])
    expect(
      await publishItem({ name, preset: DEFAULT, itemUrl: (n) => n }),
    ).toBeUndefined()
})
