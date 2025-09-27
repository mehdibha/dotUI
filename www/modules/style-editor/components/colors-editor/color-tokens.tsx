"use client";

import React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { SCALE_STEPS } from "@dotui/style-engine/constants";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { SelectItem } from "@dotui/ui/components/select";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { cn } from "@dotui/ui/lib/utils";
import type { ScaleId } from "@dotui/style-engine/types";
import type { TableRootProps } from "@dotui/ui/components/table";

import { ContextualHelp } from "@/components/ui/contextual-help";
import { EditableInput } from "@/components/ui/editable-input";
import {
  useGeneratedTheme,
  useStyleEditorForm,
} from "@/modules/style-editor/context/style-editor-provider";
import { useGeneratedScales } from "@/modules/style-editor/hooks/use-generated-scales";

export const ColorTokens = ({
  variant = "line",
  hideHeader = false,
  className,
  tokenIds,
  ...props
}: TableRootProps & {
  tokenIds: string[];
  hideHeader?: boolean;
}) => {
  const form = useStyleEditorForm();

  return (
    <TableRoot
      aria-label="Tokens"
      variant={variant}
      className={cn("", className)}
      {...props}
    >
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
              <TableCell className="flex items-center gap-2 pl-0">
                <TokenName tokenId={tokenId} />
                {tokenDefinition.description && (
                  <ContextualHelp>{tokenDefinition.description}</ContextualHelp>
                )}
              </TableCell>
              <TableCell>
                <TokenSelect tokenId={tokenId} colorScales={["neutral"]} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
};

const TokenName = ({ tokenId }: { tokenId: string }) => {
  const form = useStyleEditorForm();

  return (
    <div className="bg-muted rounded-full p-1 pl-3">
      <form.AppField name={`theme.colors.tokens.${tokenId}.name`}>
        {(field) => (
          <EditableInput
            value={field.state.value}
            onSubmit={(newVal) => field.handleChange(newVal)}
            className="text-fg-muted !text-sm font-normal [&_[data-slot='button']]:rounded-full"
          />
        )}
      </form.AppField>
    </div>
  );
};

const TokenSelect = ({
  tokenId,
  colorScales,
}: {
  tokenId: string;
  colorScales: ScaleId[];
}) => {
  const form = useStyleEditorForm();
  const generatedTheme = useGeneratedTheme();

  return (
    <form.AppField name={`theme.colors.tokens.${tokenId}.value`}>
      {(field) => {
        const [scale, _step] = field.state.value
          .replace("var(--", "")
          .replace(")", "")
          .split("-");

        const colors = generatedTheme.find((s) => s.name === scale);

        return (
          <field.Select
            aria-label="Select variable value"
            size="sm"
            renderValue={({ defaultChildren }) => defaultChildren}
            suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
            className="w-40"
          >
            {colorScales.flatMap((scale) =>
              SCALE_STEPS.map((step, i) => (
                <SelectItem
                  key={`${scale}-${step}`}
                  id={`var(--${scale}-${step})`}
                  prefix={<ColorSwatch color={colors?.values[i]?.value} />}
                >
                  {`${scale.charAt(0).toUpperCase() + scale.slice(1)} ${step}`}
                </SelectItem>
              )),
            )}
          </field.Select>
        );
      }}
    </form.AppField>
  );
};
