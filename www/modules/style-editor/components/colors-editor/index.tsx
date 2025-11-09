"use client";

import { COLOR_TOKENS } from "@dotui/registry/tokens/registry";
import { FieldGroup, Fieldset, Label, Legend } from "@dotui/registry/ui/field";

import { ColorAdjustments } from "@/modules/style-editor/components/colors-editor/color-adjustments";
import { ColorScale } from "@/modules/style-editor/components/colors-editor/color-scale";
import { ColorScaleEditor } from "@/modules/style-editor/components/colors-editor/color-scale-editor";
import {
  ModeConfig,
  ModeSwitch,
} from "@/modules/style-editor/components/colors-editor/mode-config";
import { AccentEmphasisEditor } from "./accent-emphasis-editor";
import { TokensTable } from "./tokens-table";

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
  return (
    <FieldGroup>
      <Fieldset>
        <Legend>Mode</Legend>
        <FieldGroup className="flex-row justify-between">
          <ModeConfig />
          <ModeSwitch />
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Color adjustments</Legend>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <ColorAdjustments />
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Base colors</Legend>
        <FieldGroup>
          <div className="flex items-center gap-2 @max-lg:grid @max-lg:grid-cols-2">
            {(["neutral", "accent"] as const).map((color) => {
              return <ColorScaleEditor key={color} scaleId={color} />;
            })}
          </div>
          <div className="space-y-4">
            {baseColors.map((color) => {
              return <ColorScale key={color.name} scaleId={color.name} />;
            })}
          </div>
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Semantic colors</Legend>
        <FieldGroup>
          <div className="flex items-center gap-2 @max-lg:grid @max-lg:grid-cols-2">
            {(["success", "danger", "warning", "info"] as const).map(
              (color) => {
                return <ColorScaleEditor key={color} scaleId={color} />;
              },
            )}
          </div>
          <div className="space-y-4">
            {semanticColors.map((color) => {
              return <ColorScale key={color.name} scaleId={color.name} />;
            })}
          </div>
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Accent emphasis</Legend>
        <FieldGroup>
          <AccentEmphasisEditor />
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Tokens</Legend>
        <FieldGroup>
          {(
            [
              {
                name: "Backgrounds",
                category: "background",
              },
              {
                name: "Foregrounds",
                category: "foreground",
              },
              {
                name: "Borders",
                category: "border",
              },
            ] as const
          ).map(({ name, category }) => (
            <div key={name}>
              <Label id={`${name}-label`} className="text-sm font-medium">
                {name}
              </Label>
              <TokensTable
                aria-labelledby={`${name}-label`}
                tokenIds={Object.entries(COLOR_TOKENS)
                  .filter(([, token]) => token.categories?.includes(category))
                  .filter(([tokenId]) => !tokenId.startsWith("color-fg-on"))
                  .map(([key]) => key)}
              />
            </div>
          ))}
        </FieldGroup>
      </Fieldset>
    </FieldGroup>
  );
}
