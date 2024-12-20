import { promises as fs } from "node:fs";
import { tmpdir } from "os";
import path from "path";
import { Project, ScriptKind, type SourceFile } from "ts-morph";
import { z } from "zod";
import { Config } from "@/helpers/get-config";
import { transformCssVars } from "@/helpers/transformers/transform-css-vars";
import { transformImport } from "@/helpers/transformers/transform-import";
import { transformJsx } from "@/helpers/transformers/transform-jsx";
import { transformRsc } from "@/helpers/transformers/transform-rsc";
import { transformTwPrefixes } from "./transform-tw-prefix";

export type TransformOpts = {
  filename: string;
  raw: string;
  config: Config;
  transformJsx?: boolean;
};

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  }
) => Promise<Output>;

const project = new Project({
  compilerOptions: {},
});

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
  return path.join(dir, filename);
}

export async function transform(
  opts: TransformOpts,
  transformers: Transformer[] = [
    transformImport,
    transformRsc,
    transformCssVars,
    transformTwPrefixes,
  ]
) {
  const tempFile = await createTempSourceFile(opts.filename);
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    transformer({ sourceFile, ...opts });
  }

  if (opts.transformJsx) {
    return await transformJsx({
      sourceFile,
      ...opts,
    });
  }

  return sourceFile.getText();
}
