import {
	BanIcon,
	ChevronDownIcon,
	CircleHelpIcon,
	CrosshairIcon,
	GrabIcon,
	HourglassIcon,
	LoaderCircleIcon,
	type LucideIcon,
	MousePointer2Icon,
	MoveIcon,
	PointerIcon,
	TextCursorIcon,
} from "lucide-react";

import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select } from "@/registry/ui/select";

export const CURSOR_INTERACTIVE_VAR = "--cursor-interactive";
export const CURSOR_DISABLED_VAR = "--cursor-disabled";
export const DEFAULT_CURSOR_INTERACTIVE = "default";
export const DEFAULT_CURSOR_DISABLED = "not-allowed";

const cursorOptions: ReadonlyArray<{ value: string; label: string; icon: LucideIcon }> = [
	{ value: "default", label: "Default", icon: MousePointer2Icon },
	{ value: "pointer", label: "Pointer", icon: PointerIcon },
	{ value: "not-allowed", label: "Not allowed", icon: BanIcon },
	{ value: "wait", label: "Wait", icon: HourglassIcon },
	{ value: "help", label: "Help", icon: CircleHelpIcon },
	{ value: "crosshair", label: "Crosshair", icon: CrosshairIcon },
	{ value: "text", label: "Text", icon: TextCursorIcon },
	{ value: "move", label: "Move", icon: MoveIcon },
	{ value: "grab", label: "Grab", icon: GrabIcon },
	{ value: "progress", label: "Progress", icon: LoaderCircleIcon },
];

/**
 * A small swatch carrying the real CSS cursor (hover it to feel the cursor) plus a glyph that
 * stands in for it — used as the leading icon on every cursor option and on the trigger.
 */
function CursorSwatch({ value, icon: Icon }: { value: string; icon: LucideIcon }) {
	return (
		<span
			aria-hidden
			className="flex size-5 shrink-0 items-center justify-center rounded-sm border bg-bg text-fg-muted"
			style={{ cursor: value }}
		>
			<Icon className="size-3" />
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
	const current = cursorOptions.find((opt) => opt.value === value) ?? cursorOptions[0];
	return (
		<Select selectedKey={value} onSelectionChange={(key) => onChange(key as string)}>
			<Button size="sm" className="w-full justify-start gap-2">
				<CursorSwatch value={current.value} icon={current.icon} />
				<span className="flex-1 truncate text-left">{current.label}</span>
				<ChevronDownIcon data-icon-end="" />
			</Button>
			<Popover>
				<ListBox>
					{cursorOptions.map((opt) => (
						<ListBoxItem key={opt.value} id={opt.value} textValue={opt.label}>
							<CursorSwatch value={opt.value} icon={opt.icon} />
							{opt.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
		</Select>
	);
}
