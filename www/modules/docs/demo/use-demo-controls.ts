"use client";

import React from "react";

import {
  areControlValuesEqual,
  buildControlDefaults,
  type ControlValue,
  type DemoControl,
} from "./controls";
import {
  applyControlsToCodeSource,
  applyControlsToPreviewSource,
} from "./source-transforms";

interface UseDemoControlsArgs {
  component: React.ReactNode;
  controls?: DemoControl[];
  codeSource?: string;
  previewSource?: string;
}

interface UseDemoControlsResult {
  hasControls: boolean;
  controlValues: Record<string, ControlValue>;
  renderedComponent: React.ReactNode;
  previewSourceForBlocks?: string;
  codeSourceForBlocks?: string;
  handleControlChange: (name: string, value: ControlValue) => void;
}

export const useDemoControls = ({
  component,
  controls,
  codeSource,
  previewSource,
}: UseDemoControlsArgs): UseDemoControlsResult => {
  const hasControls = Boolean(controls?.length);

  const controlDefaults = React.useMemo(
    () => buildControlDefaults(controls),
    [controls],
  );

  const [controlValues, setControlValues] =
    React.useState<Record<string, ControlValue>>(controlDefaults);

  React.useEffect(() => {
    setControlValues((previous) =>
      areControlValuesEqual(previous, controlDefaults)
        ? previous
        : controlDefaults,
    );
  }, [controlDefaults]);

  const computedControlProps = React.useMemo(() => {
    if (!hasControls) {
      return undefined;
    }

    return Object.entries(controlValues).reduce<Record<string, ControlValue>>(
      (acc, [key, value]) => {
        if (typeof value !== "undefined") {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );
  }, [controlValues, hasControls]);

  const renderedComponent = React.useMemo(() => {
    if (!hasControls || !computedControlProps) {
      return component;
    }

    if (!React.isValidElement(component)) {
      return component;
    }

    return React.cloneElement(component, computedControlProps);
  }, [component, computedControlProps, hasControls]);

  const handleControlChange = React.useCallback(
    (name: string, value: ControlValue) => {
      setControlValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const previewSourceForBlocks = React.useMemo(() => {
    if (!hasControls || !previewSource || !controls?.length) {
      return undefined;
    }

    const updatedSource = applyControlsToPreviewSource(
      previewSource,
      controls,
      controlValues,
      controlDefaults,
    );

    return updatedSource.trim();
  }, [controlDefaults, controlValues, controls, hasControls, previewSource]);

  const codeSourceForBlocks = React.useMemo(() => {
    if (!hasControls || !codeSource || !controls?.length) {
      return undefined;
    }

    const updatedSource = applyControlsToCodeSource(
      codeSource,
      controls,
      controlValues,
      controlDefaults,
    );

    return updatedSource.trim();
  }, [controlDefaults, controlValues, controls, hasControls, codeSource]);

  return {
    hasControls,
    controlValues,
    renderedComponent,
    previewSourceForBlocks,
    codeSourceForBlocks,
    handleControlChange,
  };
};
