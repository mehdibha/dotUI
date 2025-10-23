"use client";

import { registryTextures } from "@dotui/registry/textures/registry";
import { SelectItem } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { StyleEditorSection } from "@/modules/style-editor/components/section";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

export function EffectsEditor() {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();
  const { saveDraft } = useDraftStyle();

  return (
    <StyleEditorSection title="Patterns">
      {/* <form.AppField
        name="theme.backgroundPattern"
        listeners={{
          onChange: () => {
            saveDraft();
          },
        }}
      >
        {(field) => (
          <field.Select label="Background pattern" className="w-full">
            <SelectItem id="none">None</SelectItem>
            {registryBackgroundPatterns.map((pattern) => (
              <SelectItem key={pattern.slug} id={pattern.slug}>
                {pattern.name}
              </SelectItem>
            ))}
          </field.Select>
        )}
      </form.AppField> */}

      <form.AppField
        name="theme.texture"
        listeners={{
          onChange: () => {
            saveDraft();
          },
        }}
      >
        {(field) => (
          <Skeleton show={isPending} className="mt-2">
            <field.Select label="Texture" className="mt-2 w-full">
              <SelectItem id="none">None</SelectItem>
              {registryTextures.map((texture) => (
                <SelectItem key={texture.slug} id={texture.slug}>
                  {texture.name}
                </SelectItem>
              ))}
            </field.Select>
          </Skeleton>
        )}
      </form.AppField>
    </StyleEditorSection>
  );
}
