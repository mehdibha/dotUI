"use client";

import { onBlackWhite, type PairingResult, verify } from "@dotui/colors";

import { PALETTE_ORDER, type ResolvedPalettes } from "@/registry/theme";

/** The solid surface every palette's filled components sit on (buttons, badges, …). */
const SOLID_STEP = "500";

/**
 * WCAG report for the auto-foreground text on each palette's solid (500) surface — the
 * pairing dotUI actually ships (`onBlackWhite` mirrors the autocontrast plugin). Surfaces the
 * kernel's `verify/` layer so a custom palette's accessibility is visible, not blind.
 */
export function solidContrastReport(resolved: ResolvedPalettes): PairingResult[] {
	const pairings = PALETTE_ORDER.flatMap((name) => {
		const bg = resolved.light[name]?.[SOLID_STEP];
		return bg ? [{ name, fg: onBlackWhite(bg), bg }] : [];
	});
	return verify(pairings, { suggestFix: false }).results;
}

function LevelBadge({ level }: { level: PairingResult["level"] }) {
	if (level === "fail") {
		return <span className="rounded bg-danger px-1.5 py-0.5 text-[10px] font-medium text-fg-on-danger">Fail</span>;
	}
	return <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted">{level}</span>;
}

/** Per-palette readout: text-on-solid contrast ratio + WCAG level (AA / AAA / Fail). */
export function ContrastReadout({ resolved }: { resolved: ResolvedPalettes }) {
	const results = solidContrastReport(resolved);
	if (results.length === 0) return null;

	return (
		<div className="flex flex-col gap-1.5">
			<span className="pl-1 text-xs font-medium text-fg-muted">Contrast — text on solid surface</span>
			<div className="flex flex-col gap-1">
				{results.map((r) => (
					<div key={r.name} className="flex items-center gap-2 text-xs">
						<span
							className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold"
							style={{ backgroundColor: r.bg, color: r.fg }}
						>
							Aa
						</span>
						<span className="flex-1 capitalize">{r.name}</span>
						<span className="text-fg-muted tabular-nums">{r.ratio.toFixed(1)}:1</span>
						<LevelBadge level={r.level} />
					</div>
				))}
			</div>
		</div>
	);
}
