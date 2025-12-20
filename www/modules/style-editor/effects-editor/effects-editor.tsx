"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

import { StyleEditorSection } from "@/modules/style-editor/section";

// Static texture list for UI shell
const STATIC_TEXTURES = [
	{ slug: "earthen-haze", name: "Earthen haze" },
	{ slug: "fractal-noise", name: "Fractal noise" },
	{ slug: "paper-grain", name: "Paper grain" },
];

export function EffectsEditor() {
	return (
		<StyleEditorSection title="Patterns">
			<Select aria-label="Texture" defaultSelectedKey="none" className="mt-2 w-full">
				<SelectTrigger />
				<SelectContent>
					<SelectItem id="none">None</SelectItem>
					{STATIC_TEXTURES.map((texture) => (
						<SelectItem key={texture.slug} id={texture.slug}>
							{texture.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</StyleEditorSection>
	);
}
