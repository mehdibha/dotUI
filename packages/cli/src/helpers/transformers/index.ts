import { ExtendedConfig } from "@dotui/schemas";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { Project, ScriptKind, type SourceFile } from "ts-morph";
import { transformImport } from "./transform-import";

export type TransformOptions = {
  filename: string;
  raw: string;
  config: ExtendedConfig;
};

export type Transformer<Output = SourceFile> = (
  opts: TransformOptions & {
    sourceFile: SourceFile;
  }
) => Promise<Output>;

const project = new Project({
  compilerOptions: {},
});

export async function transform(
  options: TransformOptions,
  transformers: Transformer[] = [transformImport]
) {
  const tempFile = await createTempSourceFile(options.filename);
  const sourceFile = project.createSourceFile(tempFile, options.raw, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    await transformer({ sourceFile, ...options });
  }

  return sourceFile.getText();
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
  return path.join(dir, filename);
}
