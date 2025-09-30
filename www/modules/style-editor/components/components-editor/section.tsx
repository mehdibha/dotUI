"use client";

import { cn } from "@dotui/registry/lib/utils";
import { FormControl } from "@dotui/registry/ui/form";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import type { VariantsDefinition } from "@dotui/registry/__style-system__/types";

import { ColorTokens } from "@/modules/style-editor/components/colors-editor/color-tokens";
import { DraftStyleProvider } from "@/modules/style-editor/components/draft-style-provider";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

interface SectionProps extends React.ComponentProps<"div"> {
  name: keyof VariantsDefinition;
  title: string;
  variants: { name: string; label: string }[];
  previewClassName?: string;
  tokens?: string[];
}

export const Section = ({
  name,
  title,
  variants,
  tokens,
  previewClassName,
  children,
  className,
  ...props
}: SectionProps) => {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();

  return (
    <div className={cn(className)} {...props}>
      <p
        className={cn("text-base font-semibold", title !== "Loader" && "mt-6")}
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
              {variants.map((variant) => (
                <SelectItem key={variant.name} id={variant.name}>
                  {variant.label}
                </SelectItem>
              ))}
            </field.Select>
          </Skeleton>
        )}
      </form.AppField>

      {tokens && <ColorTokens hideHeader tokenIds={tokens} className="mt-2" />}

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
