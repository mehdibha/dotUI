import { allDocs, type Doc } from "content-collections";

export { allDocs };

export function getDocBySlug(slug: string[]): Doc | undefined {
  const fullSlug = slug.join("/");
  return allDocs.find((doc) => doc._meta.path === fullSlug);
}
