"use client";

import { cn } from "@dotui/registry/lib/utils";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";
import type { TableProps } from "@dotui/registry/ui/table";

import { ContextualHelp } from "@/components/ui/contextual-help";
import type { ScaleId } from "@/modules/style-editor/types";
import { SCALE_STEPS } from "@/modules/style-editor/types";

// Static color values for UI shell
const STATIC_COLORS: Record<ScaleId, string[]> = {
	neutral: SCALE_STEPS.map((_, i) => `hsl(220, ${5 + i}%, ${95 - i * 8}%)`),
	accent: SCALE_STEPS.map((_, i) => `hsl(220, 90%, ${95 - i * 8}%)`),
	success: SCALE_STEPS.map((_, i) => `hsl(142, 70%, ${95 - i * 8}%)`),
	warning: SCALE_STEPS.map((_, i) => `hsl(38, 90%, ${95 - i * 8}%)`),
	danger: SCALE_STEPS.map((_, i) => `hsl(0, 70%, ${95 - i * 8}%)`),
	info: SCALE_STEPS.map((_, i) => `hsl(190, 80%, ${95 - i * 8}%)`),
};

// Static token definitions for UI shell
const STATIC_TOKENS: Record<
	string,
	{ name: string; description?: string; categories: string[]; scales?: (ScaleId | "..")[] }
> = {
	"color-bg": {
		name: "Background",
		description: "Primary background color",
		categories: ["background"],
		scales: ["neutral"],
	},
	"color-card": {
		name: "Card",
		description: "Card background color",
		categories: ["background"],
		scales: ["neutral"],
	},
	"color-muted": {
		name: "Muted",
		description: "Muted background color",
		categories: ["background"],
		scales: ["neutral"],
	},
	"color-fg": {
		name: "Foreground",
		description: "Primary text color",
		categories: ["foreground"],
		scales: ["neutral"],
	},
	"color-fg-muted": {
		name: "Muted text",
		description: "Secondary text color",
		categories: ["foreground"],
		scales: ["neutral"],
	},
	"color-border": {
		name: "Border",
		description: "Default border color",
		categories: ["border"],
		scales: ["neutral"],
	},
	"color-border-field": {
		name: "Field border",
		description: "Input field border",
		categories: ["border"],
		scales: ["neutral"],
	},
};

export const TokensTable = ({
	hideHeader = false,
	className,
	category,
	...props
}: TableProps & {
	category: "background" | "foreground" | "border";
	hideHeader?: boolean;
}) => {
	const tokenIds = Object.entries(STATIC_TOKENS)
		.filter(([, token]) => token.categories.includes(category))
		.map(([key]) => key);

	return (
		<Table {...props}>
			<TableHeader className={cn(hideHeader && "sr-only")}>
				<TableColumn id="name" isRowHeader className="pl-0">
					Variable name
				</TableColumn>
				<TableColumn id="value" className="pr-0">
					Value
				</TableColumn>
			</TableHeader>
			<TableBody>
				{tokenIds.map((tokenId) => {
					const tokenDefinition = STATIC_TOKENS[tokenId];
					if (!tokenDefinition) return null;
					return (
						<TableRow key={tokenId} id={tokenId}>
							<TableCell className="pl-0">
								<div className="flex items-center gap-2">
									<div className="rounded-full bg-muted p-1 px-3 font-medium">{tokenDefinition.name}</div>
									{tokenDefinition.description && (
										<ContextualHelp aria-label="description" className="text-sm">
											{tokenDefinition.description}
										</ContextualHelp>
									)}
								</div>
							</TableCell>
							<TableCell>
								<TokenSelect colorScales={tokenDefinition.scales} />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

const TokenSelect = ({
	colorScales = ["neutral", "accent", "success", "warning", "danger", "info"],
}: {
	colorScales?: (ScaleId | "..")[];
}) => {
	return (
		<Select aria-label="Select variable value" defaultSelectedKey="var(--neutral-100)" className="w-40">
			<SelectTrigger />
			<SelectContent>
				{colorScales
					.filter((scale): scale is ScaleId => scale !== "..")
					.flatMap((scale) => {
						const colors = STATIC_COLORS[scale];
						return SCALE_STEPS.map((step, i) => (
							<SelectItem key={`${scale}-${step}`} id={`var(--${scale}-${step})`}>
								<ColorSwatch color={colors[i]} />
								{`${scale.charAt(0).toUpperCase() + scale.slice(1)} ${step}`}
							</SelectItem>
						));
					})}
			</SelectContent>
		</Select>
	);
};
