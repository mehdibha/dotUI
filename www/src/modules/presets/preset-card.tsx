import { useMemo } from "react";

import { Link as RouterLink } from "@tanstack/react-router";

import { ArrowRightIcon } from "lucide-react";

import { encodePreset } from "@/modules/create/preset";
import { Badge } from "@/registry/ui/badge";
import { buttonStyles } from "@/registry/ui/button";

import { PREVIEW_SHADES, type PresetDefinition } from "./data";

interface PresetCardProps {
	preset: PresetDefinition;
}

const FALLBACK_ACCENT_RAMP: Record<number, string> = {
	200: "hsl(0, 0%, 94%)",
	400: "hsl(0, 0%, 85%)",
	500: "hsl(0, 0%, 80%)",
	700: "hsl(0, 0%, 70%)",
	900: "hsl(0, 0%, 16%)",
};

export function PresetCard({ preset }: PresetCardProps) {
	const { name, description, tags, system } = preset;

	const encoded = useMemo(() => encodePreset(system), [system]);

	const radiusFactor = Number.parseFloat(system.tokens["--radius-factor"] ?? "1") || 1;
	const swatches = PREVIEW_SHADES.map((shade) => system.tokens[`--accent-${shade}`] ?? FALLBACK_ACCENT_RAMP[shade]);

	return (
		<RouterLink
			to="/create"
			search={{ preset: encoded }}
			className="group relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-fg"
		>
			<div
				aria-hidden="true"
				className="relative flex h-32 items-end justify-between overflow-hidden border bg-bg p-3"
				style={{ borderRadius: `calc(0.75rem * ${radiusFactor})` }}
			>
				<div className="flex items-end gap-1.5">
					{swatches.map((color, i) => (
						<div
							key={i}
							className="size-7 border border-bg shadow-sm"
							style={{
								background: color,
								borderRadius: `calc(0.5rem * ${radiusFactor})`,
							}}
						/>
					))}
				</div>
				<div className="flex flex-col items-end gap-1.5">
					<div
						className="h-3 w-16 bg-fg/80"
						style={{ borderRadius: `calc(0.375rem * ${radiusFactor})` }}
					/>
					<div
						className="h-2 w-10 bg-fg-muted/60"
						style={{ borderRadius: `calc(0.375rem * ${radiusFactor})` }}
					/>
					<div
						className="mt-2 h-6 w-20 bg-fg text-[10px] leading-6 text-bg"
						style={{ borderRadius: `calc(0.375rem * ${radiusFactor})` }}
					>
						<span className="block text-center">Button</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between gap-3">
					<h3 className="text-base font-medium tracking-tight">{name}</h3>
					<ArrowRightIcon className="size-4 -translate-x-1 text-fg-muted opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
				</div>
				<p className="text-sm text-fg-muted">{description}</p>
			</div>

			<div className="mt-auto flex flex-wrap items-center gap-1.5">
				<Badge size="sm" variant="neutral" className="capitalize">
					{system.density}
				</Badge>
				<Badge size="sm" variant="neutral">
					radius {radiusFactor}x
				</Badge>
				{tags.map((tag) => (
					<Badge key={tag} size="sm" variant="neutral">
						{tag}
					</Badge>
				))}
			</div>

			<span
				className={buttonStyles({
					size: "sm",
					variant: "default",
					className: "pointer-events-none w-full justify-center",
				})}
			>
				Open in customizer
			</span>
		</RouterLink>
	);
}
