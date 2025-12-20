"use client";

import * as icons from "@dotui/registry/icons";
import { iconLibraries } from "@dotui/registry/icons/registry";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { Slider, SliderControl } from "@dotui/registry/ui/slider";

import { StyleEditorSection } from "@/modules/style-editor/section";

export function IconsEditor() {
	return (
		<div>
			<StyleEditorSection title="Iconography">
				<Select aria-label="Icon library" defaultSelectedKey="lucide" className="w-full">
					<SelectTrigger />
					<SelectContent>
						{iconLibraries.map((library) => (
							<SelectItem key={library.name} id={library.name}>
								{library.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Slider
					aria-label="Stroke width"
					className="w-full"
					defaultValue={2}
					minValue={0.5}
					maxValue={3}
					step={0.1}
				>
					<SliderControl />
				</Slider>

				<p data-slot="label" className="mt-6">
					Icons
				</p>
				<div className="rounded-md border p-4">
					<div className="grid max-h-[168px] gap-2 overflow-hidden [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] [&_svg]:size-6">
						{Object.entries(icons)
							.slice(0, 100)
							.map(([name, IconComponent]) => {
								return (
									<div key={name} className="flex items-center justify-center">
										<IconComponent />
									</div>
								);
							})}
					</div>
				</div>
			</StyleEditorSection>
		</div>
	);
}
