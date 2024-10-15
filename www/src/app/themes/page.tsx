"use client";

import React from "react";
import { CopyIcon} from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { Preview } from "@/components/themes/preview";

export default function Page() {
  const [currentSection, setCurrentSection] = React.useState<string>("colors");

  return (
    <div className="container grid grid-cols-12 gap-10">
      <div className="col-span-6 py-12">
        <h1 className="font-heading xs:text-2xl text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
          Everything starts with identity.
        </h1>
        <h2 className="text-fg-muted mt-3 text-sm">
          Generate colors, fonts, and spacing to match your brand identity.
        </h2>
        <div className="mt-4 flex items-center gap-2">
          <DialogRoot>
            <Button variant="primary">Explore themes</Button>
            <Dialog type="drawer" className="container max-w-screen-lg !py-8">
              <h2 className="text-2xl font-bold">Pre-built themes</h2>
              <div className="mt-4 grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-bg-muted h-36 rounded-md border"
                  />
                ))}
              </div>
            </Dialog>
          </DialogRoot>
          <Button variant="outline" prefix={<CopyIcon />}>
            Copy code
          </Button>
        </div>
        <div className="mt-10">
          <Section
            title="Colors"
            onHoverStart={() => setCurrentSection("colors")}
          >
            <h4 className="font-heading text-pretty font-semibold">
              <span className="text-fg-muted">#</span> Mode
            </h4>
            <TagGroup
              selectionMode="single"
              defaultSelectedKeys={["light"]}
              disallowEmptySelection
              className="mt-2"
            >
              <Tag id="light">Light</Tag>
              <Tag id="dark">Dark</Tag>
            </TagGroup>
            <h4 className="font-heading mt-4 text-pretty font-semibold">
              <span className="text-fg-muted">#</span> Base colors
            </h4>
            <div className="mt-2 flex items-center gap-2">
              {[
                { label: "Neutral", value: "neutral", color: "#000000" },
                { label: "Success", value: "success", color: "#1A9338" },
                { label: "Warning", value: "warning", color: "#E79D13" },
                { label: "Danger", value: "danger", color: "#D93036" },
                { label: "Accent", value: "accent", color: "#0091FF" },
              ].map((colorBase) => (
                <ColorPicker
                  key={colorBase.value}
                  variant="outline"
                  size="sm"
                  shape="rectangle"
                  defaultValue={colorBase.color}
                  aria-label={colorBase.label}
                  className="flex-1"
                >
                  <span className="flex-1 text-left">{colorBase.label}</span>
                </ColorPicker>
              ))}
            </div>
            <h4 className="font-heading mt-4 text-pretty font-semibold">
              <span className="text-fg-muted">#</span> Scales
            </h4>
            <div className="mt-2 flex flex-col gap-2">
              {[
                { label: "Neutral", value: "neutral" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Danger", value: "danger" },
                { label: "Accent", value: "accent" },
              ].map((colorBase) => (
                <ColorScale key={colorBase.value} {...colorBase} />
              ))}
            </div>
          </Section>
          <Section
            title="Typography"
            onHoverStart={() => {
              setCurrentSection("typography");
            }}
          >
            <h4 className="font-semibold">
              <span className="text-fg-muted">#</span> Heading
            </h4>
            <Select
              className="mt-2 [&_button]:w-full"
              defaultSelectedKey="Arial"
            >
              <Item id="Arial">Geist sans</Item>
            </Select>
            <h4 className="mt-4 font-semibold">
              <span className="text-fg-muted">#</span> Body
            </h4>
            <Select
              className="mt-2 [&_button]:w-full"
              defaultSelectedKey="Arial"
            >
              <Item id="Arial">Inter</Item>
            </Select>
          </Section>
          <Section
            title="Icons"
            onHoverStart={() => {
              setCurrentSection("icons");
            }}
          >
            <h4 className="font-semibold">
              <span className="text-fg-muted">#</span> Icon library
            </h4>
            <Select
              className="mt-2 [&_button]:w-full"
              defaultSelectedKey="Arial"
            >
              <Item id="Arial">Lucide icons</Item>
            </Select>
          </Section>
        </div>
      </div>
      <div className="sticky top-0 col-span-6 flex h-screen items-center justify-center">
        <Preview currentSection={currentSection} />
      </div>
    </div>
  );
}

const Section = ({
  title,
  children,
  className,
  wrapperClassName,
  onHoverStart,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  onHoverStart?: () => void;
}) => {
  return (
    <div className={cn("mt-6", wrapperClassName)} onMouseEnter={onHoverStart}>
      <h3 className="font-heading text-pretty border-b pb-2 text-xl font-semibold">
        {title}
      </h3>
      <div className={cn("mt-4", className)}>{children}</div>
    </div>
  );
};

const ColorScale = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-row gap-2 xl:flex-row xl:items-center">
      <div className="w-[80px]">
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <ul className="flex w-full items-center gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="w-full">
            <Tooltip content={`${value}-${index * 100}`}>
              <div
                className="h-10 w-full rounded-md border"
                style={{
                  backgroundColor: `hsl(var(--color-${value}-${index * 100}))`,
                }}
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};
