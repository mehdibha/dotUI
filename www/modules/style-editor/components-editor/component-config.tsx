"use client";

import { cn } from "@dotui/registry/lib/utils";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import type { VariantsDefinition } from "@dotui/style-system";

import { TokensTable } from "@/modules/style-editor/colors-editor/tokens-table";
import { DraftStyleProvider } from "@/modules/style-editor/draft-style-provider";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";

interface ComponentConfigProps extends React.ComponentProps<"div"> {
  name: keyof VariantsDefinition;
  title: string;
  variants: { name: string; label: string }[];
  previewClassName?: string;
  tokens?: string[];
}

export const ComponentConfig = ({
  name,
  title,
  variants,
  tokens,
  previewClassName,
  children,
  className,
  ...props
}: ComponentConfigProps) => {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();

  return (
    <div className={cn(className)} {...props}>
      <p
        className={cn("font-semibold text-base", title !== "Loader" && "mt-6")}
      >
        {title}
      </p>

      <form.AppField name={`variants.${name}`}>
        {(field) => (
          <Skeleton show={isPending} className="mt-2">
            <field.Select
              aria-label="Select component variant"
              className="mt-2 w-full"
            >
              <SelectTrigger />
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant.name} id={variant.name}>
                    {variant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </field.Select>
          </Skeleton>
        )}
      </form.AppField>

      {tokens && <TokensTable hideHeader tokenIds={tokens} className="mt-2" />}

      <Skeleton show={isPending}>
        <DraftStyleProvider
          className={cn(
            "mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-8",
            previewClassName,
          )}
        >
          {children}
        </DraftStyleProvider>
      </Skeleton>
    </div>
  );
};
