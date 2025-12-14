"use client";

import { registryTextures } from "@dotui/registry/textures/registry";
import { SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";
import { StyleEditorSection } from "@/modules/style-editor/section";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";

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
						<field.Select aria-label="Texture" className="mt-2 w-full">
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="none">None</SelectItem>
								{registryTextures.map((texture) => (
									<SelectItem key={texture.slug} id={texture.slug}>
										{texture.name}
									</SelectItem>
								))}
							</SelectContent>
						</field.Select>
					</Skeleton>
				)}
			</form.AppField>
		</StyleEditorSection>
	);
}
