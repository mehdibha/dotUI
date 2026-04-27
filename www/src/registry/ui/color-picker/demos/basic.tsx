import { Button } from "@/registry/ui/button";
import { ColorArea } from "@/registry/ui/color-area";
import { ColorField } from "@/registry/ui/color-field";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSlider, ColorSliderControl } from "@/registry/ui/color-slider";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<ColorPicker>
			<Button isIconOnly>
				<ColorSwatch />
			</Button>
			<Popover>
				<DialogContent>
					<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" className="w-full" />
					<ColorSlider colorSpace="hsb" channel="hue" />
				</DialogContent>
			</Popover>
		</ColorPicker>
	);
}
