"use client";

import React from "react";

import { Label } from "@dotui/ui/components/field";
import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import {
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { StyleEditorSection } from "@/modules/styles/components/style-editor/section";

export function AdjustmentsSection() {
  const { form, resolvedMode, isSuccess } = useStyleForm();

  return (
    <StyleEditorSection title="Color adjustments">
      <div className="mt-2 grid grid-cols-2 gap-3">
        <FormControl
          key={`theme.colors.modes.${resolvedMode}.lightness`}
          name={`theme.colors.modes.${resolvedMode}.lightness`}
          control={form.control}
          render={(props) => (
            <SliderRoot {...props} minValue={0} maxValue={100} className="col-span-2 w-full">
              <div className="flex items-center justify-between gap-2">
                <Label>Lightness</Label>
                <SliderValueLabel>
                  {({ state }) => (
                    <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
                  )}
                </SliderValueLabel>
              </div>
              <Skeleton show={!isSuccess}>
                <SliderTrack>
                  <SliderFiller />
                  <SliderThumb />
                </SliderTrack>
              </Skeleton>
            </SliderRoot>
          )}
        />
        <FormControl
          key={`${resolvedMode}.saturation`}
          name={`theme.colors.modes.${resolvedMode}.saturation`}
          control={form.control}
          render={(props) => (
            <SliderRoot {...props} minValue={0} maxValue={100} className="w-full">
              <div className="flex items-center justify-between gap-2">
                <Label>Saturation</Label>
                <SliderValueLabel>
                  {({ state }) => (
                    <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
                  )}
                </SliderValueLabel>
              </div>
              <Skeleton show={!isSuccess}>
                <SliderTrack>
                  <SliderFiller />
                  <SliderThumb />
                </SliderTrack>
              </Skeleton>
            </SliderRoot>
          )}
        />
        <FormControl
          key={`${resolvedMode}.contrast`}
          name={`theme.colors.modes.${resolvedMode}.contrast`}
          control={form.control}
          render={(props) => (
            <SliderRoot {...props} minValue={0} maxValue={500} className="w-full">
              <div className="flex items-center justify-between gap-2">
                <Label>Contrast</Label>
                <SliderValueLabel>
                  {({ state }) => (
                    <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
                  )}
                </SliderValueLabel>
              </div>
              <Skeleton show={!isSuccess}>
                <SliderTrack>
                  <SliderFiller />
                  <SliderThumb />
                </SliderTrack>
              </Skeleton>
            </SliderRoot>
          )}
        />
      </div>
    </StyleEditorSection>
  );
}

