import React from "react";
import { Button } from "@/components/core/button";
import { Checkbox } from "@/components/core/checkbox";
import { Input } from "@/components/core/input";
import { Radio } from "@/components/core/radio-group";
import { Select } from "@/components/core/select";
import { Switch } from "@/components/core/switch";
import { Textarea } from "@/components/core/text-area";
import { ColorItem } from "./ColorItem";
import { ComponentSection } from "./ComponentSection";
import { Section } from "./Section";

export function ThemeContent() {
  return (
    <div className="space-y-12">
      {/* Colors Section */}
      <Section
        title="Colors"
        description="Theme color palette and variations"
        className="mt-6 space-y-6"
      >
        <ComponentSection title="Primary Colors">
          <div className="flex">
            <ColorItem
              colorName="Primary"
              colorValue="#3B82F6"
              style={{ backgroundColor: "#3B82F6" }}
            />
            <ColorItem
              colorName="Primary Dark"
              colorValue="#2563EB"
              style={{ backgroundColor: "#2563EB" }}
            />
            <ColorItem
              colorName="Primary Light"
              colorValue="#60A5FA"
              style={{ backgroundColor: "#60A5FA" }}
            />
          </div>
        </ComponentSection>

        <ComponentSection title="Neutral Colors">
          <div className="flex">
            <ColorItem
              colorName="Gray"
              colorValue="#6B7280"
              style={{ backgroundColor: "#6B7280" }}
            />
            <ColorItem
              colorName="Gray Dark"
              colorValue="#4B5563"
              style={{ backgroundColor: "#4B5563" }}
            />
            <ColorItem
              colorName="Gray Light"
              colorValue="#9CA3AF"
              style={{ backgroundColor: "#9CA3AF" }}
            />
          </div>
        </ComponentSection>
      </Section>

      {/* Typography Section */}
      <Section
        title="Typography"
        description="Text styles and components"
        className="mt-6 space-y-6"
      >
        <ComponentSection title="Headings">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-medium">Heading 3</h3>
            <h4 className="text-xl font-medium">Heading 4</h4>
          </div>
        </ComponentSection>

        <ComponentSection title="Body Text">
          <div className="space-y-4">
            <p className="text-base">
              Regular paragraph text. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </p>
            <p className="text-fg-muted text-sm">
              Small text with muted color for secondary information.
            </p>
          </div>
        </ComponentSection>
      </Section>

      {/* Components Section */}
      <Section
        title="Components"
        description="Interactive UI elements"
        className="mt-6 space-y-6"
      >
        <ComponentSection title="Buttons">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </ComponentSection>

        <ComponentSection title="Form Controls">
          <div className="space-y-4">
            <Input placeholder="Text input" />
            <Textarea placeholder="Textarea" />
            <Select>
              <option value="">Select option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select>
          </div>
        </ComponentSection>

        <ComponentSection title="Toggle Controls">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch id="switch" />
              <label htmlFor="switch">Switch</label>
            </div>
            <div className="flex items-center gap-4">
              <Checkbox id="checkbox" />
              <label htmlFor="checkbox">Checkbox</label>
            </div>
            <div className="flex items-center gap-4">
              <Radio id="radio" name="radio-group" />
              <label htmlFor="radio">Radio</label>
            </div>
          </div>
        </ComponentSection>
      </Section>
    </div>
  );
}
