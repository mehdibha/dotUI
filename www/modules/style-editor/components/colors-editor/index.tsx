"use client";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";

import { ColorAdjustments } from "@/modules/style-editor/components/colors-editor/color-adjustments";
import { ColorScale } from "@/modules/style-editor/components/colors-editor/color-scale";
import { ColorScaleEditor } from "@/modules/style-editor/components/colors-editor/color-scale-editor";
import {
  ModeConfig,
  ModeSwitch,
} from "@/modules/style-editor/components/colors-editor/mode-config";
import { StyleEditorSection } from "@/modules/style-editor/components/section";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { AccentEmphasisEditor } from "./accent-emphasis-editor";
import { ColorTokens } from "./color-tokens";

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

export function ColorsEditor() {
  const { resolvedMode } = useResolvedModeState();

  return (
    <div>
      <StyleEditorSection title="Mode">
        <div className="mt-2 flex items-start justify-between">
          <ModeConfig />
          <ModeSwitch />
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Color adjustments">
        <ColorAdjustments />
      </StyleEditorSection>

      <StyleEditorSection title="Base colors">
        <div className="@max-lg:grid @max-lg:grid-cols-2 mt-2 flex items-center gap-2">
          {(["neutral", "accent"] as const).map((color) => {
            return <ColorScaleEditor key={color} scaleId={color} />;
          })}
        </div>
        <div className="mt-3 space-y-2">
          {baseColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div>
      </StyleEditorSection>

      <StyleEditorSection
        key={`${resolvedMode}-semantic-colors`}
        title="Semantic colors"
      >
        <div className="@max-lg:grid @max-lg:grid-cols-2 mt-2 flex items-center gap-2">
          {(["success", "danger", "warning", "info"] as const).map((color) => {
            return <ColorScaleEditor key={color} scaleId={color} />;
          })}
        </div>
        <div className="mt-3 space-y-2">
          {semanticColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Accent emphasis">
        <AccentEmphasisEditor />
      </StyleEditorSection>

      <StyleEditorSection key={`${resolvedMode}-tokens`} title="Tokens">
        <div className="mt-3 space-y-4">
          {[
            {
              name: "Backgrounds",
              category: "background" as const,
            },
            {
              name: "Foregrounds",
              category: "foreground" as const,
            },
            {
              name: "Borders",
              category: "border" as const,
            },
          ].map(({ name, category }) => (
            <div key={name}>
              <h3 className="text-sm font-medium">{name}</h3>
              <ColorTokens
                tokenIds={Object.entries(COLOR_TOKENS)
                  .filter(([, token]) => token.categories?.includes(category))
                  .filter(([tokenId]) => !tokenId.startsWith("color-fg-on"))
                  .map(([key]) => key)}
              />
            </div>
          ))}
        </div>
      </StyleEditorSection>
    </div>
  );
}
