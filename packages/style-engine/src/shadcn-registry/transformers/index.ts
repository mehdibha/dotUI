import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { Project, ScriptKind } from "ts-morph";
import type { SourceFile } from "ts-morph";

import { transformIcons } from "./transform-icons";
import { transformImport } from "./transform-imports";
import type { Style } from "../../types";

export interface TransformOpts {
  filename: string;
  raw: string;
  style: Style;
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  },
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
  transformers: Transformer[] = [transformImport, transformIcons],
) {
  const tempFile = await createTempSourceFile(opts.filename);
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    await transformer({ sourceFile, ...opts });
  }

  return sourceFile.getText();
}
