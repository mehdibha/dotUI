"use client";

import { COLOR_TOKENS } from "@dotui/registry/tokens/registry";

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
    <div className="space-y-4">
      <StyleEditorSection
        title="Mode"
        className="flex items-start justify-between"
      >
        <ModeConfig />
        <ModeSwitch />
      </StyleEditorSection>

      <StyleEditorSection title="Color adjustments">
        <ColorAdjustments />
      </StyleEditorSection>

      <StyleEditorSection title="Base colors">
        <div className="mt-2 flex items-center gap-2 @max-lg:grid @max-lg:grid-cols-2">
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
        <div className="mt-2 flex items-center gap-2 @max-lg:grid @max-lg:grid-cols-2">
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
