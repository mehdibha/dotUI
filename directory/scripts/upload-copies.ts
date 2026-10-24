// Puts each captured system's copies on the Blob store the deployed site reads
// (src/components/looks/copy.tsx), one file per census date. Needs
// BLOB_READ_WRITE_TOKEN and the census in www/.scratch-refs/<slug>/.
//   pnpm --filter directory copies:upload [slug...]
import { put } from "@vercel/blob"

import { bundleCopies, capturedSlugs, copyPaths } from "./copies"

const slugs = process.argv.slice(2)

for (const slug of slugs.length ? slugs : capturedSlugs()) {
  for (const [date, paths] of copyPaths(slug)) {
    const { copies, missing } = bundleCopies(slug, paths)
    // A partial census would overwrite a complete file with fewer copies.
    if (missing.length) {
      console.warn(
        `${slug}/${date}: ${missing.length} of ${paths.size} copies not in www/.scratch-refs, skipped`,
      )
      continue
    }
    const { url } = await put(`${slug}/${date}.json`, JSON.stringify(copies), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 3600,
    })
    console.log(`${url}: ${paths.size} copies`)
  }
}
