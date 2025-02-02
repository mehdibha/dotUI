import { Project, ScriptKind, type SourceFile } from "ts-morph";
import { Config } from "@/helpers/get-config";

export type TransformOpts = {
  filename: string;
  raw: string;
  config: Config;
};

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  }
) => Promise<Output>;

export async function transform(
  options: TransformOpts,
  transforms: Transformer[]
) {
  return options.raw;
}
