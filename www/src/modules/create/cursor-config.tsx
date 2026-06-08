import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select } from "@/registry/ui/select";

import { CursorGlyph } from "./cursor-glyphs";

export const CURSOR_INTERACTIVE_VAR = "--cursor-interactive";
export const CURSOR_DISABLED_VAR = "--cursor-disabled";
export const DEFAULT_CURSOR_INTERACTIVE = "default";
export const DEFAULT_CURSOR_DISABLED = "not-allowed";

const cursorOptions = [
	{ value: "default", label: "Default" },
	{ value: "pointer", label: "Pointer" },
	{ value: "not-allowed", label: "Not allowed" },
	{ value: "wait", label: "Wait" },
	{ value: "help", label: "Help" },
	{ value: "crosshair", label: "Crosshair" },
	{ value: "text", label: "Text" },
	{ value: "move", label: "Move" },
	{ value: "grab", label: "Grab" },
	{ value: "progress", label: "Progress" },
];

/** The cursor glyph, carrying the real CSS cursor so hovering it feels the actual cursor. */
function CursorIcon({ value }: { value: string }) {
	return (
		<span aria-hidden className="flex size-4 shrink-0 items-center justify-center" style={{ cursor: value }}>
			<CursorGlyph value={value} className="size-4" />
		</span>
	);
}

interface CursorConfigProps {
	interactive: string;
	disabled: string;
	onChange: (paramName: string, value: string) => void;
}

export function CursorConfig({ interactive, disabled, onChange }: CursorConfigProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<span className="text-xs font-medium text-fg-muted">Interactive</span>
				<CursorSelect value={interactive} onChange={(v) => onChange(CURSOR_INTERACTIVE_VAR, v)} />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-xs font-medium text-fg-muted">Disabled</span>
				<CursorSelect value={disabled} onChange={(v) => onChange(CURSOR_DISABLED_VAR, v)} />
			</div>
		</div>
	);
}

function CursorSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	const current = cursorOptions.find((opt) => opt.value === value) ?? { value: "default", label: "Default" };
	return (
		<Select selectedKey={value} onSelectionChange={(key) => onChange(key as string)}>
			<Button size="sm" className="w-full justify-start gap-2">
				<CursorIcon value={current.value} />
				<span className="flex-1 truncate text-left">{current.label}</span>
				<ChevronDownIcon data-icon-end="" />
			</Button>
			<Popover>
				<ListBox>
					{cursorOptions.map((opt) => (
						<ListBoxItem key={opt.value} id={opt.value} textValue={opt.label}>
							<CursorIcon value={opt.value} />
							{opt.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
		</Select>
	);
}
