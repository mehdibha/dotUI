import { vi } from "vitest"

/** Stubs `window` with an in-memory localStorage; `otherTab` writes like a second tab would. */
export function installFakeWindow() {
  const data = new Map<string, string>()
  const target = new EventTarget()
  const localStorage = {
    getItem: vi.fn((key: string) => data.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void data.set(key, value)),
    removeItem: vi.fn((key: string) => void data.delete(key)),
  }
  vi.stubGlobal("window", Object.assign(target, { localStorage }))

  return {
    localStorage,
    read: (key: string) => data.get(key) ?? null,
    seed: (key: string, value: string) => void data.set(key, value),
    /** Writes storage; the `storage` event only fires when `deliver` is set. */
    otherTab(key: string, value: string | null, deliver = true) {
      if (value === null) data.delete(key)
      else data.set(key, value)
      if (deliver)
        target.dispatchEvent(Object.assign(new Event("storage"), { key }))
    },
  }
}
