"use client";

import React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  InfoIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { useWatch } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { SCALE_NUMBERRS } from "@dotui/style-engine/constants";
import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { cn } from "@dotui/ui/lib/utils";
import type { TableRootProps } from "@dotui/ui/components/table";

import { AutoResizeTextField } from "@/components/auto-resize-input";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

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
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();

  const formTokens = useWatch({
    control: form.control,
    name: "theme.colors.tokens",
  });

  return (
    <>
      <Skeleton show={!isSuccess}>
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
            {tokenIds
              .filter((tokenId) => !tokenId.startsWith("color-fg-on"))
              .map((tokenId) => {
                const tokenDef = COLOR_TOKENS.find(
                  (def) => def.name === tokenId,
                );
                const index = formTokens.findIndex(
                  (token) => token.name === tokenId,
                );
                return (
                  <TableRow key={tokenId} id={tokenId}>
                    <TableCell className="pl-0">
                      <ColorTokenVariableName
                        index={index}
                        description={tokenDef?.description}
                      />
                    </TableCell>
                    <TableCell>
                      <ColorTokenValue index={index} />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TableRoot>
      </Skeleton>
    </>
  );
};

const ColorTokenVariableName = ({
  index,
  description,
}: {
  index: number;
  description?: string;
}) => {
  const form = useStyleEditorForm();
  const [isEditMode, setEditMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = React.useCallback((initialValue: string) => {
    setLocalValue(initialValue);
    setEditMode(true);
  }, []);

  const handleCancel = React.useCallback(() => {
    setEditMode(false);
  }, []);

  const handleSubmit = React.useCallback(() => {
    form.setValue(`theme.colors.tokens.${index}.name`, localValue);
    setEditMode(false);
  }, [form, index, localValue]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        inputRef.current &&
        isEditMode
      ) {
        handleCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCancel, isEditMode]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditMode) {
        handleCancel();
      }
    };
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditMode) {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [handleCancel, handleSubmit, isEditMode]);

  return (
    <FormControl
      name={`theme.colors.tokens.${index}.name`}
      control={form.control}
      render={(props) => (
        <div className="w-70 flex items-center gap-2">
          <div className="bg-bg-muted rounded-full p-1 pl-3">
            {isEditMode ? (
              <div ref={containerRef} className="flex items-center gap-1">
                <AutoResizeTextField
                  inputRef={inputRef}
                  autoFocus
                  className="font-mono text-xs"
                  value={localValue}
                  onChange={setLocalValue}
                />
                <div className="flex items-center gap-0.5">
                  <Button
                    aria-label="Save"
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={handleSubmit}
                    className="size-6"
                  >
                    <CheckIcon className="text-fg-success" />
                  </Button>
                  <Button
                    aria-label="Cancel"
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={handleCancel}
                    className="size-6"
                  >
                    <XIcon className="text-fg-danger" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <h1 className="truncate whitespace-nowrap border-b font-mono text-xs">
                  {props.value}
                </h1>
                <Button
                  size="sm"
                  shape="circle"
                  variant="quiet"
                  onPress={() => handleEditStart(props.value)}
                  className="size-6 [&_svg]:size-3"
                >
                  <PencilIcon className="text-fg-muted" />
                </Button>
              </div>
            )}
          </div>
          {description && (
            <DialogRoot>
              <Button
                size="sm"
                shape="circle"
                variant="quiet"
                className="size-6 [&_svg]:size-3"
              >
                <InfoIcon />
              </Button>
              <Dialog
                type="popover"
                popoverProps={{ placement: "top", className: "max-w-64" }}
              >
                <p className="text-sm">{description}</p>
              </Dialog>
            </DialogRoot>
          )}
        </div>
      )}
    />
  );
};

const ColorTokenValue = ({ index }: { index: number }) => {
  const form = useStyleEditorForm();

  return (
    <FormControl
      name={`theme.colors.tokens.${index}.value`}
      control={form.control}
      render={({ value, onChange, ...props }) => {
        const [color] = value
          .replace("var(--", "")
          .replace(")", "")
          .split("-") as [string, string];

        const items = SCALE_NUMBERRS.map((scale, i) => ({
          label: `${color.charAt(0).toUpperCase() + color.slice(1)} ${scale}`,
          value: `var(--${color}-${scale})`,
        }));

        return (
          <SelectRoot
            selectedKey={value}
            onSelectionChange={onChange}
            {...props}
          >
            <Button
              size="sm"
              suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
              className="w-40"
            >
              <SelectValue>
                {({ defaultChildren }) => <>{defaultChildren}</>}
              </SelectValue>
            </Button>
            <Popover>
              <ListBox items={items}>
                {(item) => (
                  <ListBoxItem
                    id={item.value}
                    className="flex items-center gap-2"
                    prefix={
                      <span
                        className="size-4 rounded-sm border"
                        style={{
                          backgroundColor: item.value,
                        }}
                      />
                    }
                  >
                    {item.label}
                  </ListBoxItem>
                )}
              </ListBox>
            </Popover>
          </SelectRoot>
        );
      }}
    />
  );
};
