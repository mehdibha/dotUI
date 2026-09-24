import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

/** Content-addressed snapshot storage: an id is written once, never replaced. */
export interface SnapshotStore {
  /** Resolves when `id` holds a snapshot; an existing id is left as is. */
  put(id: string, json: string): Promise<void>
  get(id: string): Promise<string | null>
}

export function memoryStore(): SnapshotStore {
  const entries = new Map<string, string>()
  return {
    async put(id, json) {
      if (!entries.has(id)) entries.set(id, json)
    },
    async get(id) {
      return entries.get(id) ?? null
    },
  }
}

export function fileStore(dir: string): SnapshotStore {
  const file = (id: string) => path.join(dir, `${id}.json`)
  return {
    async put(id, json) {
      await mkdir(dir, { recursive: true })
      try {
        await writeFile(file(id), json, { flag: "wx" })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error
      }
    },
    async get(id) {
      try {
        return await readFile(file(id), "utf8")
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
        throw error
      }
    },
  }
}

/** Vercel Blob; authenticates with `BLOB_READ_WRITE_TOKEN`. */
export function blobStore(): SnapshotStore {
  const pathname = (id: string) => `snapshots/${id}.json`
  const store: SnapshotStore = {
    async put(id, json) {
      const { put } = await import("@vercel/blob")
      try {
        await put(pathname(id), json, {
          access: "private",
          addRandomSuffix: false,
          contentType: "application/json",
        })
      } catch (error) {
        // Refused overwrites are errors; the same id is the same content.
        if ((await store.get(id)) === null) throw error
      }
    },
    async get(id) {
      const { get } = await import("@vercel/blob")
      const result = await get(pathname(id), {
        access: "private",
        useCache: false,
      })
      if (!result || result.statusCode !== 200) return null
      return new Response(result.stream).text()
    },
  }
  return store
}

// Vercel's filesystem is read-only: without a Blob token, fail loudly there.
function unconfiguredStore(): SnapshotStore {
  const fail = async (): Promise<never> => {
    throw new Error(
      "Snapshot storage is not configured: link a Vercel Blob store (BLOB_READ_WRITE_TOKEN)",
    )
  }
  return { put: fail, get: fail }
}

let store: SnapshotStore | undefined

export function getSnapshotStore(): SnapshotStore {
  store ??= process.env.BLOB_READ_WRITE_TOKEN
    ? blobStore()
    : process.env.VERCEL
      ? unconfiguredStore()
      : fileStore(path.resolve(".data/snapshots"))
  return store
}
