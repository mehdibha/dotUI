import { createMDXSource } from "@fumadocs/content-collections";
import { allDocs } from "content-collections";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/",
  source: createMDXSource(allDocs, []),
});
