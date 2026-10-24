/* Each render tab keeps its own storage. The panel makes its preset the
   site's current design system, and tabs sharing localStorage would hand
   each other theirs through `storage` events. */

const items = new Map<string, string>()

const memory: Storage = {
  get length() {
    return items.size
  },
  key: (index) => [...items.keys()][index] ?? null,
  getItem: (key) => items.get(key) ?? null,
  setItem: (key, value) => void items.set(key, String(value)),
  removeItem: (key) => void items.delete(key),
  clear: () => items.clear(),
}

Object.defineProperty(window, "localStorage", { value: memory })
