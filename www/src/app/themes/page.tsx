"use client";

import { Button } from "@/registry/ui/default/core/button";
import { ColorField } from "@/registry/ui/default/core/color-field";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";

export default function Page() {
  return (
    <div className="container max-w-screen-lg pt-14">
      <h1 className="font-heading xs:text-2xl text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
        Everything starts with identity.
      </h1>
      <h2 className="text-fg-muted mt-3 text-sm">
        Generate colors, fonts, and spacing to match your brand identity.
      </h2>
      <div className="mt-4 flex items-center gap-2">
        <Button variant="primary">Explore themes</Button>
        <Button>Copy code</Button>
      </div>
      <div className="mt-10">
        <Section title="Colors">
          <h4 className="font-heading mt-4 text-pretty text-lg font-semibold">
            Base colors
          </h4>
          <div className="mt-2 flex items-center gap-2">
            {[
              { label: "Neutral", value: "neutral", color: "#000000" },
              { label: "Success", value: "success", color: "#1A9338" },
              { label: "Warning", value: "warning", color: "#E79D13" },
              { label: "Danger", value: "danger", color: "#D93036" },
              { label: "Accent", value: "accent", color: "#0091FF" },
            ].map((colorBase) => (
              <ColorField
                key={colorBase.value}
                defaultValue={colorBase.color}
                label={colorBase.label}
                prefix={
                  <ColorPicker
                    size="sm"
                    shape="rectangle"
                    defaultValue={colorBase.color}
                    aria-label={colorBase.label}
                    className="h-6 p-0"
                  />
                }
              />
            ))}
          </div>
          <h4 className="font-heading mt-4 text-pretty text-lg font-semibold">
            Scales
          </h4>
          <div className="mt-2 flex flex-col gap-4">
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
        <Section title="Typeface">
          <div className="grid grid-cols-[230px_1fr] gap-10">
            <div className="">
              <h4 className="text-md font-semibold">Heading</h4>
              <Select
                className="mt-2 [&_button]:w-full"
                defaultSelectedKey="Arial"
              >
                <Item id="Arial">Geist sans</Item>
              </Select>
              <h4 className="text-md mt-4 font-semibold">Body</h4>
              <Select
                className="mt-2 [&_button]:w-full"
                defaultSelectedKey="Arial"
              >
                <Item id="Arial">Inter</Item>
              </Select>
            </div>
            <div>
              <p className="text-4xl font-bold">Heading 1</p>
              <p className="mt-2 text-3xl font-bold">Heading 2</p>
              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </Section>
        <Section title="Icons">
          <div className=""></div>
          <p className="text-fg-muted">Icons content</p>
        </Section>
      </div>
    </div>
  );
}

const Section = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mt-6", className)}>
      <h3 className="font-heading text-pretty border-b pb-2 text-xl font-semibold">
        {title}
      </h3>
      <div className="mt-6">{children}</div>
    </div>
  );
};

const ColorScale = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="w-[80px]">
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <ul className="flex w-full items-center gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="w-full">
            <Tooltip content={`${value}-${index * 100}`}>
              <Button
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
