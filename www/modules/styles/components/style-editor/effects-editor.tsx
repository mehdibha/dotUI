"use client";

import { registryBackgroundPatterns } from "@dotui/registry-definition/registry-bg-patterns";
import { registryTextures } from "@dotui/registry-definition/registry-textures";
import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { FormControl } from "@dotui/ui/components/form";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { StyleEditorSection } from "./section";

export function EffectsEditor() {
  const { form, isSuccess } = useStyleForm();

  return (
    <div>
      <StyleEditorSection title="Patterns">
        <div className="mt-4 space-y-4">
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.backgroundPattern"
              control={form.control}
              render={({ value, onChange, ...props }) => (
                <Select
                  label="Background pattern"
                  className="mt-2"
                  selectedKey={value}
                  onSelectionChange={onChange}
                  {...props}
                >
                  <SelectItem id="none">None</SelectItem>
                  {registryBackgroundPatterns.map((pattern) => (
                    <SelectItem key={pattern.slug} id={pattern.slug}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.texture"
              control={form.control}
              render={({ value, onChange, ...props }) => (
                <Select
                  label="Texture"
                  className="mt-2"
                  selectedKey={value}
                  onSelectionChange={onChange}
                  {...props}
                >
                  <SelectItem id="none">None</SelectItem>
                  {registryTextures.map((texture) => (
                    <SelectItem key={texture.slug} id={texture.slug}>
                      {texture.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </Skeleton>
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Shadows">
        <Skeleton show={!isSuccess}>
          <FormControl
            name="theme.shadows.color"
            control={form.control}
            render={(props) => (
              <ColorPicker className="mt-2 w-full" {...props}>
                <ColorSwatch />
                Shadow color
              </ColorPicker>
            )}
          />
        </Skeleton>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.shadows.opacity"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Opacity"
                  defaultValue={0.25}
                  minValue={0}
                  maxValue={1}
                  step={0.05}
                  getValueLabel={(value) => `${value}%`}
                  className="col-span-2 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.shadows.blurRadius"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Blur radius"
                  defaultValue={2}
                  minValue={0}
                  maxValue={50}
                  step={1}
                  getValueLabel={(value) => `${value}px`}
                  className="col-span-1 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.shadows.spread"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Spread"
                  defaultValue={0}
                  minValue={0}
                  maxValue={100}
                  step={1}
                  getValueLabel={(value) => `${value}%`}
                  className="col-span-1 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.shadows.offsetX"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Offset X"
                  defaultValue={0}
                  minValue={-50}
                  maxValue={50}
                  step={1}
                  getValueLabel={(value) => `${value}px`}
                  className="col-span-1 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.shadows.offsetY"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Offset Y"
                  defaultValue={1}
                  minValue={-50}
                  maxValue={50}
                  step={1}
                  getValueLabel={(value) => `${value}px`}
                  className="col-span-1 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
        </div>
      </StyleEditorSection>
    </div>
  );
}
