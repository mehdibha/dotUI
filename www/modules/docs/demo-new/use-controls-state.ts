"use client";

import React from "react";

import type {
  ControlValue,
  DemoControlsMap,
  NormalizedDemoControl,
} from "./types";
import {
  applyControlsToSource,
  areControlValuesEqual,
  buildControlDefaults,
  buildShareableSearch,
  controlsHaveValues,
  parseControlValuesFromSearch,
} from "./utils";

interface UseControlsStateArgs {
  component: React.ReactNode;
  controls: DemoControlsMap;
  preview: string;
  source: string;
}

interface UseControlsStateResult {
  controls: DemoControlsMap;
  controlList: NormalizedDemoControl[];
  controlValues: Record<string, ControlValue>;
  hasControls: boolean;
  renderedComponent: React.ReactNode;
  dynamicPreview?: string;
  dynamicSource?: string;
  shareableSearch: string;
  handleValueChange: (name: string, value: ControlValue) => void;
}

export function useControlsState({
  component,
  controls,
  preview,
  source,
}: UseControlsStateArgs): UseControlsStateResult {
  const normalizedControls = React.useMemo<DemoControlsMap>(
    () => controls ?? {},
    [controls],
  );

  const controlList = React.useMemo<NormalizedDemoControl[]>(
    () => Object.values(normalizedControls),
    [normalizedControls],
  );

  const hasControls = controlsHaveValues(normalizedControls);

  const controlDefaults = React.useMemo(
    () => buildControlDefaults(normalizedControls),
    [normalizedControls],
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

  React.useEffect(() => {
    if (!hasControls || typeof window === "undefined") {
      return;
    }

    const parsed = parseControlValuesFromSearch(
      normalizedControls,
      window.location.search,
    );

    if (!Object.keys(parsed).length) {
      return;
    }

    setControlValues((previous) => ({ ...previous, ...parsed }));
  }, [normalizedControls, hasControls]);

  const handleValueChange = React.useCallback(
    (name: string, value: ControlValue) => {
      setControlValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const renderedComponent = React.useMemo(() => {
    if (!hasControls || !React.isValidElement(component)) {
      return component;
    }

    const props = Object.entries(controlValues).reduce<
      Record<string, ControlValue>
    >((acc, [key, value]) => {
      if (typeof value !== "undefined") {
        acc[key] = value;
      }
      return acc;
    }, {});

    return React.cloneElement(component, props);
  }, [component, controlValues, hasControls]);

  const dynamicPreview = React.useMemo(() => {
    if (!hasControls) return undefined;
    return applyControlsToSource(
      preview,
      normalizedControls,
      controlValues,
      controlDefaults,
    );
  }, [
    controlDefaults,
    controlValues,
    hasControls,
    normalizedControls,
    preview,
  ]);

  const dynamicSource = React.useMemo(() => {
    if (!hasControls) return undefined;
    return applyControlsToSource(
      source,
      normalizedControls,
      controlValues,
      controlDefaults,
    );
  }, [controlDefaults, controlValues, hasControls, normalizedControls, source]);

  const [shareableSearch, setShareableSearch] = React.useState("");

  React.useEffect(() => {
    if (!hasControls) {
      setShareableSearch("");
      return;
    }

    const nextSearch = buildShareableSearch(
      normalizedControls,
      controlValues,
      controlDefaults,
    );

    setShareableSearch(nextSearch);
  }, [controlDefaults, controlValues, hasControls, normalizedControls]);

  React.useEffect(() => {
    if (!hasControls || typeof window === "undefined") {
      return;
    }

    const url = `${window.location.pathname}${shareableSearch}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [hasControls, shareableSearch]);

  return {
    controls: normalizedControls,
    controlList,
    controlValues,
    hasControls,
    renderedComponent,
    dynamicPreview,
    dynamicSource,
    shareableSearch,
    handleValueChange,
  };
}
