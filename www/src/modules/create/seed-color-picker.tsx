"use client";

import { Button } from "@/registry/ui/button";
import { ColorArea } from "@/registry/ui/color-area";
import { ColorField } from "@/registry/ui/color-field";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSlider } from "@/registry/ui/color-slider";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { DialogContent } from "@/registry/ui/dialog";
import { Input } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

/**
 * A compact, self-contained color picker: a swatch + hex button that opens a
 * popover with a saturation/brightness area, a hue slider, and a hex field.
 *
 * Shared by the customizer's inline theme controls (accent / base on the panel
 * home) and the full color recipe panel, so the two never drift. Raw color
 * primitives are used inside the popover so they consume THIS ColorPicker's
 * context rather than spinning up their own (ColorEditor would shadow the
 * outer value/onChange and make the seed uneditable).
 */
export function SeedColorPicker({
	value,
	onChange,
	"aria-label": ariaLabel,
}: {
	value: string;
	onChange: (hex: string) => void;
	"aria-label"?: string;
}) {
	return (
		<ColorPicker value={value} onChange={(color) => onChange(color.toString("hex"))}>
			{({ color }) => (
				<>
					<Button size="sm" className="w-full justify-start pl-2" aria-label={ariaLabel}>
						<ColorSwatch />
						<span className="truncate font-mono text-xs">{color.toString("hex")}</span>
					</Button>
					<Popover>
						<DialogContent aria-label={ariaLabel ?? "Color picker"} className="flex flex-col gap-2">
							<div className="flex gap-2">
								<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
								<ColorSlider orientation="vertical" colorSpace="hsb" channel="hue" />
							</div>
							<ColorField aria-label="Hex" className="w-full">
								<Input size="sm" className="w-full" />
							</ColorField>
						</DialogContent>
					</Popover>
				</>
			)}
		</ColorPicker>
	);
}
