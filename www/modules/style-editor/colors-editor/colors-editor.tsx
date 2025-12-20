"use client";

import { FieldGroup, Fieldset, Label, Legend } from "@dotui/registry/ui/field";

import { ColorAdjustments } from "@/modules/style-editor/colors-editor/color-adjustments";
import { ColorScale } from "@/modules/style-editor/colors-editor/color-scale";
import { ColorScaleEditor } from "@/modules/style-editor/colors-editor/color-scale-editor";
import { ModeConfig, ModeSwitch } from "@/modules/style-editor/colors-editor/mode-config";

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
					<div className="flex @max-lg:grid @max-lg:grid-cols-2 items-center gap-2">
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
					<div className="flex @max-lg:grid @max-lg:grid-cols-2 items-center gap-2">
						{(["success", "danger", "warning", "info"] as const).map((color) => {
							return <ColorScaleEditor key={color} scaleId={color} />;
						})}
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
					<div>
						<Label id="backgrounds-label" className="font-medium text-sm">
							Backgrounds
						</Label>
						<TokensTable aria-labelledby="backgrounds-label" category="background" />
					</div>
					<div>
						<Label id="foregrounds-label" className="font-medium text-sm">
							Foregrounds
						</Label>
						<TokensTable aria-labelledby="foregrounds-label" category="foreground" />
					</div>
					<div>
						<Label id="borders-label" className="font-medium text-sm">
							Borders
						</Label>
						<TokensTable aria-labelledby="borders-label" category="border" />
					</div>
				</FieldGroup>
			</Fieldset>
		</FieldGroup>
	);
}
