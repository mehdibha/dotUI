// Puts each captured system's copies on the Blob store the deployed site reads
// (src/components/looks/copy.tsx), one file per copy at <slug>/<copy path>.
// Needs BLOB_READ_WRITE_TOKEN and the census in www/.scratch-refs/<slug>/.
//   pnpm --filter directory copies:upload [slug...]
import { put } from "@vercel/blob"

import { capturedSlugs, copyPaths, readCopy } from "./copies"

const slugs = process.argv.slice(2)

for (const slug of slugs.length ? slugs : capturedSlugs()) {
  for (const [date, paths] of copyPaths(slug)) {
    const missing = [...paths].filter((copy) => !readCopy(slug, copy))
    if (missing.length) {
      console.warn(
        `${slug}/${date}: ${missing.length} of ${paths.size} copies not in www/.scratch-refs, skipped`,
      )
      continue
    }
    const queue = [...paths]
    await Promise.all(
      Array.from({ length: 8 }, async () => {
        for (let copy = queue.pop(); copy; copy = queue.pop())
          await put(`${slug}/${copy}`, JSON.stringify(readCopy(slug, copy)), {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
            cacheControlMaxAge: 3600,
          })
      }),
    )
    console.log(`${slug}/${date}: ${paths.size} copies`)
  }
}
