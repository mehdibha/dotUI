import type { Transform, TransformContext, TransformResult } from "./types";

/**
 * Apply a series of transforms to content
 */
export function applyTransforms(
  content: string,
  transforms: Transform[],
  context: TransformContext = {}
): string {
  return transforms.reduce((c, transform) => transform(c, context), content);
}

/**
 * Apply transforms with tracking of which were applied
 */
export function applyTransformsWithTracking(
  content: string,
  transforms: Array<{ name: string; transform: Transform }>,
  context: TransformContext = {}
): TransformResult {
  const applied: string[] = [];
  let result = content;

  for (const { name, transform } of transforms) {
    const transformed = transform(result, context);
    if (transformed !== result) {
      applied.push(name);
      result = transformed;
    }
  }

  return { content: result, applied };
}
