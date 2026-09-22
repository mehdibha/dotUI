import { isNotFound } from "@tanstack/react-router"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Route } from "@/routes/internal"

function runGuard() {
  const beforeLoad = Route.options.beforeLoad as () => void
  try {
    beforeLoad()
  } catch (error) {
    return error
  }
}

describe("/internal route guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("lets /internal/* through in dev", () => {
    vi.stubEnv("DEV", true)
    expect(runGuard()).toBeUndefined()
  })

  it("404s /internal/* in production builds", () => {
    vi.stubEnv("DEV", false)
    expect(isNotFound(runGuard())).toBe(true)
  })
})
