import React from "react";
import { getColorChannels } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { ColorArea } from "@dotui/registry/ui/color-area";
import { ColorField } from "@dotui/registry/ui/color-field";
import { ColorSlider } from "@dotui/registry/ui/color-slider";
import { Input } from "@dotui/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

type ColorFormat = "hex" | "rgb" | "hsl" | "hsb";

interface ColorEditorProps extends React.ComponentProps<"div"> {
	colorFormat?: ColorFormat;
	showAlphaChannel?: boolean;
	showFormatSelector?: boolean;
}

const ColorEditor = ({
	colorFormat: ColorFormatProp = "hex",
	showAlphaChannel = false,
	showFormatSelector = true,
	className,
	...props
}: ColorEditorProps) => {
	const [colorFormat, setColorFormat] = React.useState<ColorFormat>(ColorFormatProp);

	return (
		<div className={cn("mx-auto flex flex-col gap-2", className)} {...props}>
			<div className="flex gap-2">
				<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
				<ColorSlider defaultValue="#000000" orientation="vertical" colorSpace="hsb" channel="hue" />
				{showAlphaChannel && (
					<ColorSlider defaultValue="#000000" orientation="vertical" colorSpace="hsb" channel="alpha" />
				)}
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
						getColorChannels(colorFormat).map((channel) => (
							<ColorField key={channel} colorSpace={colorFormat} channel={channel} className="w-10 flex-1">
								<Input size="sm" className="w-full" />
							</ColorField>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export { ColorEditor };
export type { ColorEditorProps };
