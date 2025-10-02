"use client";

import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { SCALE_STEPS } from "@dotui/registry/style-system/constants";
import { COLOR_TOKENS } from "@dotui/registry/tokens/registry";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { SelectItem } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/registry/ui/table";
import type { ScaleId } from "@dotui/registry/style-system/types";
import type { TableRootProps } from "@dotui/registry/ui/table";

import { ContextualHelp } from "@/components/ui/contextual-help";
import { EditableInput } from "@/components/ui/editable-input";
import {
  useGeneratedTheme,
  useStyleEditorForm,
} from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useDraftStyle } from "../../atoms/draft-style-atom";

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
              <TableCell className="pl-0">
                <div className="flex items-center gap-2">
                  <TokenName tokenId={tokenId} />
                  {tokenDefinition.description && (
                    <ContextualHelp
                      dialogProps={{
                        className: "text-sm",
                      }}
                    >
                      {tokenDefinition.description}
                    </ContextualHelp>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TokenSelect
                  tokenId={tokenId}
                  colorScales={tokenDefinition.scales}
                />
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
  const { isPending } = useEditorStyle();

  return (
    <form.Subscribe
      selector={(state) => state.values.theme.colors.tokens[tokenId]?.name}
    >
      {(name) => (
        <Skeleton show={isPending} className="rounded-full">
          <div className="bg-muted rounded-full p-1 px-3 font-medium">
            {name}
            {/* <EditableInput
              value={field.state.value}
              onSubmit={(newVal) => field.handleChange(newVal as any)}
              className="text-fg-muted !text-sm font-normal [&_[data-slot='button']]:rounded-full"
            /> */}
          </div>
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
          <>
            <Skeleton show={isPending} className="w-40">
              <field.Select
                aria-label="Select variable value"
                size="sm"
                renderValue={({ defaultChildren }) => defaultChildren}
                suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
                className="w-40"
              >
                {colorScales
                  .filter((scale) => scale !== "..")
                  .flatMap((scale) => {
                    const colors = generatedTheme.find((s) => s.name === scale);
                    return SCALE_STEPS.map((step, i) => (
                      <SelectItem
                        key={`${scale}-${step}`}
                        id={`var(--${scale}-${step})`}
                        prefix={
                          <ColorSwatch color={colors?.values[i]?.value} />
                        }
                      >
                        {`${scale.charAt(0).toUpperCase() + scale.slice(1)} ${step}`}
                      </SelectItem>
                    ));
                  })}
              </field.Select>
            </Skeleton>
          </>
        );
      }}
    </form.AppField>
  );
};
