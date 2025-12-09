export interface BuildOptions {
  /** Path to registry source (e.g., packages/registry/src) */
  srcDir: string;
  /** Output directory for JSON files (e.g., packages/registry/dist) */
  outDir: string;
  /** Whether to format JSON output */
  pretty?: boolean;
}

export interface ItemJson {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: FileEntry[];
  /** Variant-specific file overrides */
  variants?: Record<string, { files: FileEntry[] }>;
  defaultVariant?: string;
}

export interface FileEntry {
  path: string;
  content: string;
  type?: string;
  target?: string;
}

export interface Manifest {
  version: string;
  generatedAt: string;
  items: ManifestItem[];
}

export interface ManifestItem {
  name: string;
  type: string;
  category: string;
  path: string;
  variants?: string[];
}
