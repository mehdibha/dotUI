"use client";

import { registryBackgroundPatterns } from "@dotui/registry/background-patterns/registry";
import { registryTextures } from "@dotui/registry/textures/registry";
import { SelectItem } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { StyleEditorSection } from "../section";

export function EffectsEditor() {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();

  return (
    <div>
      <StyleEditorSection title="Patterns">
        <div className="mt-4 space-y-4">
          <form.AppField name="theme.backgroundPattern">
            {(field) => (
              <Skeleton show={isPending} className="mt-2">
                <field.Select
                  label="Background pattern"
                  className="mt-2 w-full"
                >
                  <SelectItem id="none">None</SelectItem>
                  {registryBackgroundPatterns.map((pattern) => (
                    <SelectItem key={pattern.slug} id={pattern.slug}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </field.Select>
              </Skeleton>
            )}
          </form.AppField>

          <form.AppField name="theme.texture">
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
        </div>
      </StyleEditorSection>
    </div>
  );
}
