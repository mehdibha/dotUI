import { presets } from "./data";
import { PresetCard } from "./preset-card";

export function PresetsGallery() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{presets.map((preset) => (
				<PresetCard key={preset.id} preset={preset} />
			))}
		</div>
	);
}
