import React from "react";

import * as ColorAreaPrimitives from "react-aria-components/ColorArea";
import * as ColorPickerPrimitives from "react-aria-components/ColorPicker";

import { cn } from "@/registry/lib/utils";
import { ColorArea } from "@/registry/ui/color-area";
import { ColorField } from "@/registry/ui/color-field";
import { ColorSlider } from "@/registry/ui/color-slider";
import { Input } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

type ColorFormat = "hex" | "rgb" | "hsl" | "hsb";

interface ColorEditorProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "color"> {
	colorFormat?: ColorFormat;
	showAlphaChannel?: boolean;
	showFormatSelector?: boolean;
	value?: ColorPickerPrimitives.ColorPickerProps["value"];
	defaultValue?: ColorPickerPrimitives.ColorPickerProps["defaultValue"];
	onChange?: ColorPickerPrimitives.ColorPickerProps["onChange"];
}

const ColorEditor = ({
	colorFormat: ColorFormatProp = "hex",
	showAlphaChannel = false,
	showFormatSelector = true,
	value,
	defaultValue = "#6366F1",
	onChange,
	className,
	...props
}: ColorEditorProps) => {
	const [colorFormat, setColorFormat] = React.useState<ColorFormat>(ColorFormatProp);

	return (
		<div className={cn("mx-auto flex flex-col gap-2", className)} {...props}>
			<ColorPickerPrimitives.ColorPicker value={value} defaultValue={defaultValue} onChange={onChange}>
				<div className="flex gap-2">
					<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
					<ColorSlider orientation="vertical" colorSpace="hsb" channel="hue" />
					{showAlphaChannel && <ColorSlider orientation="vertical" colorSpace="hsb" channel="alpha" />}
				</div>
				<div className={cn("flex flex-col gap-2", colorFormat === "hex" && "flex-row")}>
					{showFormatSelector && (
						<Select
							aria-label="Color format"
							value={colorFormat}
							onChange={(key) => setColorFormat(key as ColorFormat)}
							className={cn("w-auto", colorFormat === "hex" && "flex-1")}
						>
							<SelectTrigger size="sm" className="w-full" />
							<SelectContent>
								<SelectItem id="hex">Hex</SelectItem>
								<SelectItem id="rgb">RGB</SelectItem>
								<SelectItem id="hsl">HSL</SelectItem>
								<SelectItem id="hsb">HSB</SelectItem>
							</SelectContent>
						</Select>
					)}
					<div className="flex flex-1 items-center gap-2">
						{colorFormat === "hex" ? (
							<ColorField aria-label="Hex" className="w-10 flex-1">
								<Input size="sm" className="w-full" />
							</ColorField>
						) : (
							ColorAreaPrimitives.getColorChannels(colorFormat).map((channel) => (
								<ColorField key={channel} colorSpace={colorFormat} channel={channel} className="w-10 flex-1">
									<Input size="sm" className="w-full" />
								</ColorField>
							))
						)}
					</div>
				</div>
			</ColorPickerPrimitives.ColorPicker>
		</div>
	);
};

export type { ColorEditorProps };
export { ColorEditor };
