import {
  injectAttributesIntoSource,
  stripPropsTypeAnnotations,
} from "@/modules/docs/code-transform";
import type {
  ControlValue,
  DemoControl,
} from "@/modules/docs/component-controls";
import { buildControlAttributes } from "./control-attributes";

export const applyControlsToPreviewSource = (
  previewSource: string,
  controls: DemoControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  const updated = injectAttributesIntoSource(previewSource, attributes);
  return stripPropsTypeAnnotations(updated);
};

export const applyControlsToCodeSource = (
  codeSource: string,
  controls: DemoControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  const updated = injectAttributesIntoSource(codeSource, attributes);
  return stripPropsTypeAnnotations(updated);
};
