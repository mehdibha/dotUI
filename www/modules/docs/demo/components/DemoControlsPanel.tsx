"use client";

import type {
  ControlValue,
  DemoControl,
} from "@/modules/docs/component-controls";
import {
  type DemoControlsProps,
  DemoControls as LegacyDemoControls,
} from "@/modules/docs/demo-controls";

interface DemoControlsPanelProps {
  controls: DemoControl[];
  values: Record<string, ControlValue>;
  onValueChange: DemoControlsProps["onValueChange"];
}

export const DemoControlsPanel = ({
  controls,
  values,
  onValueChange,
}: DemoControlsPanelProps) => {
  if (!controls.length) {
    return null;
  }

  return (
    <LegacyDemoControls
      controls={controls}
      values={values}
      onValueChange={onValueChange}
    />
  );
};
