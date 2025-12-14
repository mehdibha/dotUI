"use client";

import { cn } from "@dotui/registry/lib/utils";
import { COLOR_TOKENS } from "@dotui/registry/tokens/registry";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";
import { SCALE_STEPS } from "@dotui/style-system/core";
import type { TableProps } from "@dotui/registry/ui/table";
import type { ScaleId } from "@dotui/style-system/types";

import { ContextualHelp } from "@/components/ui/contextual-help";
import { useGeneratedTheme, useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";

import { useDraftStyle } from "../draft-style-atom";

export const TokensTable = ({
	hideHeader = false,
	className,
	tokenIds,
	...props
}: TableProps & {
	tokenIds: string[];
	hideHeader?: boolean;
}) => {
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
					const tokenDefinition = COLOR_TOKENS[tokenId];
					if (!tokenDefinition) return null;
					return (
						<TableRow key={tokenId} id={tokenId}>
							<TableCell className="pl-0">
								<div className="flex items-center gap-2">
									<TokenName tokenId={tokenId} />
									{tokenDefinition.description && (
										<ContextualHelp aria-label="description" className="text-sm">
											{tokenDefinition.description}
										</ContextualHelp>
									)}
								</div>
							</TableCell>
							<TableCell>
								<TokenSelect tokenId={tokenId} colorScales={tokenDefinition.scales} />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

const TokenName = ({ tokenId }: { tokenId: string }) => {
	const form = useStyleEditorForm();
	const { isPending } = useEditorStyle();

	return (
		<form.Subscribe selector={(state) => state.values.theme.colors.tokens[tokenId]?.name}>
			{(name) => (
				<Skeleton show={isPending} className="rounded-full">
					<div className="rounded-full bg-muted p-1 px-3 font-medium">{name}</div>
				</Skeleton>
			)}
		</form.Subscribe>
	);
};

const TokenSelect = ({
	tokenId,
	colorScales = ["neutral", "accent", "success", "warning", "danger", "info"],
}: {
	tokenId: string;
	colorScales?: (ScaleId | "..")[];
}) => {
	const form = useStyleEditorForm();
	const generatedTheme = useGeneratedTheme();
	const { saveDraft } = useDraftStyle();
	const { isPending } = useEditorStyle();

	return (
		<form.AppField
			name={`theme.colors.tokens.${tokenId}.value`}
			listeners={{
				onChange: () => {
					saveDraft();
				},
			}}
		>
			{(field) => {
				return (
					<Skeleton show={isPending} className="w-40">
						<field.Select aria-label="Select variable value" className="w-40">
							<SelectTrigger />
							<SelectContent>
								{colorScales
									.filter((scale) => scale !== "..")
									.flatMap((scale) => {
										const colors = generatedTheme.find((s) => s.name === scale);
										return SCALE_STEPS.map((step, i) => (
											<SelectItem key={`${scale}-${step}`} id={`var(--${scale}-${step})`}>
												<ColorSwatch color={colors?.values[i]?.value} />
												{`${scale.charAt(0).toUpperCase() + scale.slice(1)} ${step}`}
											</SelectItem>
										));
									})}
							</SelectContent>
						</field.Select>
					</Skeleton>
				);
			}}
		</form.AppField>
	);
};
