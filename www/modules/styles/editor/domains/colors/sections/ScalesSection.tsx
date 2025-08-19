"use client";

import React from "react";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { StyleEditorSection } from "@/modules/styles/components/style-editor/section";
import { ColorScale } from "@/modules/styles/components/style-editor/color-scale";
import { ColorScaleEditor } from "@/modules/styles/components/style-editor/color-scale-editor";

const baseColors = [
  { name: "neutral", label: "Neutral" },
  { name: "accent", label: "Accent" },
] as const;

const semanticColors = [
  { name: "success", label: "Success", color: "#008000" },
  { name: "danger", label: "Danger", color: "#ff0000" },
  { name: "warning", label: "Warning", color: "#ffa500" },
  { name: "info", label: "Info", color: "#0000ff" },
] as const;

export function ScalesSection() {
  const { isSuccess } = useStyleForm();

  return (
    <>
      <StyleEditorSection title="Base colors">
        <div className="@max-lg:grid @max-lg:grid-cols-2 mt-2 flex items-center gap-2">
          {baseColors.map((color) => (
            <Skeleton key={color.name} show={!isSuccess}>
              <ColorScaleEditor scaleId={color.name} />
            </Skeleton>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {baseColors.map((color) => (
            <ColorScale key={color.name} scaleId={color.name} />
          ))}
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Semantic colors">
        <div className="@max-lg:grid @max-lg:grid-cols-2 mt-2 flex items-center gap-2">
          {semanticColors.map((color) => (
            <Skeleton key={color.name} show={!isSuccess}>
              <ColorScaleEditor scaleId={color.name} />
            </Skeleton>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {semanticColors.map((color) => (
            <ColorScale key={color.name} scaleId={color.name} />
          ))}
        </div>
      </StyleEditorSection>
    </>
  );
}

