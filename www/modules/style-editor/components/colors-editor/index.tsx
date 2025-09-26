"use client";

import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { StyleEditorSection } from "../section";
import { ColorAdjustments } from "./color-adjustments";
import { ColorScaleEditor } from "./color-scale-editor";
import { ModeConfig, ModeSwitch } from "./mode-config";

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
  const { isSuccess } = useEditorStyle();
  const { resolvedMode } = useResolvedModeState();

  return (
    <div>
      <StyleEditorSection title="Mode">
        <div className="mt-2 flex items-start justify-between">
          <ModeConfig />
          <ModeSwitch />
        </div>
      </StyleEditorSection>
      {/* <Tabs>
        <TabList className="-mt-4">
          <Tab>Light</Tab>
          <Tab>Dark</Tab>
          <Tab>
            <PlusCircleIcon className="size-4" />
          </Tab>
        </TabList>
      </Tabs> */}

      <StyleEditorSection title="Color adjustments">
        <ColorAdjustments />
      </StyleEditorSection>

      <StyleEditorSection title="Base colors">
        <div className="@max-lg:grid @max-lg:grid-cols-2 mt-2 flex items-center gap-2">
          {(["neutral", "accent"] as const).map((color) => {
            return <ColorScaleEditor key={color} scaleId={color} />;
          })}
        </div>
        {/* <div className="mt-3 space-y-2">
          {baseColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div> */}
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
        {/* <div className="mt-3 space-y-2">
          {semanticColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div> */}
      </StyleEditorSection>

      {/* <StyleEditorSection title="Accent emphasis">
        <AccentLevelEditor />
      </StyleEditorSection> */}

      {/* <StyleEditorSection key={`${resolvedMode}-tokens`} title="Tokens">
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
                tokenIds={COLOR_TOKENS.filter((tk) =>
                  tk.categories?.some((cat) => cat === category),
                ).map((tk) => tk.name)}
              />
            </div>
          ))}
        </div>
      </StyleEditorSection> */}
    </div>
  );
}
