import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export function LayoutConfig() {
	return (
		<div className="flex flex-col gap-5">
			{/* Border radius */}
			<div className="flex flex-col gap-3">
				<span className="font-medium text-fg-muted text-xs">Border radius</span>
				<div className="flex items-center gap-2">
					{[
						{ label: "None", value: "none", className: "rounded-none" },
						{ label: "SM", value: "sm", className: "rounded-sm" },
						{ label: "MD", value: "md", className: "rounded-md" },
						{ label: "LG", value: "lg", className: "rounded-lg" },
						{ label: "XL", value: "xl", className: "rounded-xl" },
					].map((opt) => (
						<button
							key={opt.value}
							type="button"
							className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md p-1.5 transition-colors hover:bg-muted"
						>
							<div className={`size-8 border-2 border-fg-muted/40 ${opt.className}`} />
							<span className="text-[10px] text-fg-muted">{opt.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Spacing / Compactness */}
			<div className="flex flex-col gap-3">
				<span className="font-medium text-fg-muted text-xs">Spacing</span>
				<ToggleButtonGroup defaultSelectedKeys={["default"]} selectionMode="single">
					<ToggleButton id="compact" size="sm">
						Compact
					</ToggleButton>
					<ToggleButton id="default" size="sm">
						Default
					</ToggleButton>
					<ToggleButton id="spacious" size="sm">
						Spacious
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
		</div>
	);
}
