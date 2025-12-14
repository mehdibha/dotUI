export interface TransformContext {
  /** Target icon library (e.g., "lucide", "remix") */
  iconLibrary?: string;
  /** Icon mapping from lucide names to target library */
  iconMap?: Record<string, Record<string, string>>;
  /** Any additional context needed by transforms */
  [key: string]: unknown;
}

export type Transform = (content: string, context: TransformContext) => string;

export interface TransformResult {
  content: string;
  /** Transforms that were applied */
  applied: string[];
}
