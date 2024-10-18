"use client";

import React from "react";
import { chain, mergeRefs } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  GitBranchIcon,
  XIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";
import {
  TextField as UnstyledTextField,
  Input as UnstyledInput,
} from "react-aria-components";
import { Button } from "@/registry/ui/default/core/button";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import {
  Dialog,
  DialogFooter,
  DialogRoot,
} from "@/registry/ui/default/core/dialog";
import { Label } from "@/registry/ui/default/core/field";
import { InputProps } from "@/registry/ui/default/core/input";
import { Link } from "@/registry/ui/default/core/link";
import { Item } from "@/registry/ui/default/core/list-box";
import { Radio, RadioGroup } from "@/registry/ui/default/core/radio-group";
import { Select } from "@/registry/ui/default/core/select";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { TextField } from "@/registry/ui/default/core/text-field";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { usePreview } from "./context";

export const ThemeCustomizer = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const [themeName, setThemeName] = React.useState<string>("Default");
  const { setPreview } = usePreview();

  return (
    <div {...props} className={cn("space-y-6", props.className)}>
      <div className="flex items-center justify-between border-b pb-2">
        <ThemeName currentName={themeName} setCurrentName={setThemeName} />
        <div className="flex items-center gap-2">
          <CopyThemeDialog>
            <Button variant="outline" prefix={<CopyIcon />}>
              Copy code
            </Button>
          </CopyThemeDialog>
          <CloneThemeDialog>
            <Button variant="outline" prefix={<GitBranchIcon />}>
              Clone theme
            </Button>
          </CloneThemeDialog>
        </div>
      </div>
      <Section title="Colors">
        <TagGroup
          label="Mode"
          defaultSelectedKeys={["light"]}
          selectionMode="single"
          disallowEmptySelection
          className="mt-2"
        >
          <Tag id="light">Light</Tag>
          <Tag id="dark">Dark</Tag>
        </TagGroup>
        <div>
          <Label>Base colors</Label>
          <p className="text-fg-muted text-sm">
            You can generate color scales using these base colors.
          </p>
          <div className="mt-2 flex items-center gap-2">
            {[
              {
                label: "Neutral",
                value: "neutral",
                color: "#000000",
              },
              {
                label: "Success",
                value: "success",
                color: "#1A9338",
              },
              {
                label: "Warning",
                value: "warning",
                color: "#E79D13",
              },
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
                onOpenChange={() => {
                  setPreview(`color-${colorBase.value}`);
                }}
                onHoverStart={() => {
                  setPreview(`color-${colorBase.value}`);
                }}
                className="flex-1"
              >
                {colorBase.label}
              </ColorPicker>
            ))}
          </div>
        </div>
        <div>
          <Label>Scales</Label>
          <p className="text-fg-muted text-sm">
            There are 5 color scales in the color system. You can learn more
            about it{" "}
            <Link variant="quiet" href="/docs/getting-started/color-system">
              here
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-col gap-2">
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
        </div>
      </Section>
      <Section title="Typography" onHoverStart={() => setPreview("typography")}>
        <div className="grid grid-cols-2 gap-4">
          <Select
            className="[&_button]:w-full"
            defaultSelectedKey="Arial"
            label="Heading"
          >
            <Item id="Arial">Geist sans</Item>
          </Select>
          <Select
            label="Body"
            className="[&_button]:w-full"
            defaultSelectedKey="Arial"
          >
            <Item id="Arial">Inter</Item>
          </Select>
        </div>
      </Section>
      <div className="grid grid-cols-2 gap-4">
        <Section title="Icons" onHoverStart={() => setPreview("icons")}>
          <Select
            label="Icon library"
            className="[&_button]:w-full"
            defaultSelectedKey="lucide"
          >
            <Item id="lucide">Lucide icons</Item>
          </Select>
        </Section>
        <Section title="Borders" onHoverStart={() => setPreview("borders")}>
          <TagGroup
            label="Radius"
            selectionMode="single"
            defaultSelectedKeys={["0.5"]}
            disallowEmptySelection
            className="w-full"
          >
            {[0, 0.5, 0.75, 1].map((value) => (
              <Tag key={value} id={value.toString()} className="w-14">
                {value}
              </Tag>
            ))}
          </TagGroup>
        </Section>
      </div>
    </div>
  );
};

const ThemeName = ({
  currentName,
  setCurrentName,
}: {
  currentName: string;
  setCurrentName: (value: string) => void;
}) => {
  const [edit, setEdit] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>(currentName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onDismiss = React.useCallback(() => {
    setEdit(false);
    setInputValue(currentName);
  }, [currentName]);

  const onSave = React.useCallback(() => {
    setCurrentName(inputValue);
    setEdit(false);
  }, [inputValue, setCurrentName]);

  const onEdit = () => {
    setEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && edit) {
        onSave();
      }
      if (e.key === "Escape" && edit) {
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSave, onDismiss, edit]);

  return (
    <div className="flex items-center gap-4">
      {edit ? (
        <>
          <UnstyledTextField value={inputValue} onChange={setInputValue}>
            <AutoResizeInput
              ref={inputRef}
              className="font-heading w-auto text-2xl font-semibold"
            />
          </UnstyledTextField>
          <div className="flex items-center gap-1">
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-success size-7 [&_svg]:size-3.5"
              onPress={onSave}
            >
              <CheckIcon />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-danger size-7 [&_svg]:size-3.5"
              onPress={onDismiss}
            >
              <XIcon />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-heading pb-px text-2xl font-semibold">
            {currentName}
          </h2>
          <Button
            variant="quiet"
            size="sm"
            shape="square"
            className="[&_svg]:text-fg-muted size-7 [&_svg]:size-3.5"
            onPress={onEdit}
          >
            <Edit2Icon />
          </Button>
        </>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// Dialogs
// ----------------------------------------------------------------------------

const ExploreThemesDialog = ({
  children,
  themes,
  currentTheme,
  setCurrentTheme,
}: {
  children: React.ReactNode;
  currentTheme: string;
  themes: { name: string; value: string }[];
  setCurrentTheme: (value: string) => void;
}) => {
  return (
    <DialogRoot>
      {children}
      <Dialog type="drawer" className="container max-w-screen-xl !py-8">
        <h2 className="text-lg font-bold">Themes</h2>
        <p className="text-fg-muted text-sm">
          Curated collection of handcrafted themes, inspired by leading brands
          and designed to elevate your project&apos;s visual identity.
        </p>
        <RadioGroup
          value={currentTheme}
          onChange={setCurrentTheme}
          variant="card"
          orientation="horizontal"
          className="mt-4 gap-2"
        >
          {[
            { name: "Default", value: "default" },
            { name: "Ruby", value: "ruby" },
            { name: "GitHub", value: "github" },
            { name: "Vercel", value: "vercel" },
          ].map((theme, index) => (
            <Radio key={index} value={theme.value}>
              <div className="p-0">
                <p className="font-semibold">{theme.name}</p>
                <p className="text-fg-muted text-sm">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded">
                <div className="h-5 bg-slate-600" />
                <div className="h-5 bg-green-500" />
                <div className="h-5 bg-red-500" />
                <div className="h-5 bg-amber-500" />
                <div className="h-5 bg-blue-700" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
        <h2 className="mt-6 text-lg font-bold">Your themes</h2>
        <p className="text-fg-muted text-sm">
          Custom themes you create will appear here.
        </p>
        <RadioGroup
          value={currentTheme}
          onChange={setCurrentTheme}
          variant="card"
          orientation="horizontal"
          className="mt-4 gap-2"
        >
          {[{ name: "dotUI", value: "dotUI" }].map((theme, index) => (
            <Radio key={index} value={theme.value}>
              <div className="p-0">
                <p className="font-semibold">{theme.name}</p>
                <p className="text-fg-muted text-sm">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded">
                <div className="h-5 bg-slate-600" />
                <div className="h-5 bg-green-500" />
                <div className="h-5 bg-red-500" />
                <div className="h-5 bg-amber-500" />
                <div className="h-5 bg-blue-700" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </Dialog>
    </DialogRoot>
  );
};

const CreateThemeDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Create new theme">
        {({ close }) => (
          <>
            <TextField label="Name" className="w-full" />
            <DialogFooter>
              <Button variant="outline" size="sm" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onPress={() => {
                  close();
                }}
              >
                Save theme
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
};

const CloneThemeDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Clone theme">
        {({ close }) => (
          <>
            <TextField label="Name" className="w-full" />
            <DialogFooter>
              <Button variant="outline" size="sm" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onPress={() => {
                  close();
                }}
              >
                Save theme
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
};

const CopyThemeDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Copy theme">
        <p>code here</p>
      </Dialog>
    </DialogRoot>
  );
};

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
    <div className={cn("", wrapperClassName)} onMouseEnter={onHoverStart}>
      {/* <h3 className="font-heading text-pretty text-xl font-semibold">
        {title}
      </h3> */}
      <div className={cn("mt-3 space-y-3", className)}>{children}</div>
    </div>
  );
};

const ColorScale = ({
  label,
  value,
  length = 10,
}: {
  label: string;
  value: string;
  length?: number;
}) => {
  return (
    <div className="flex flex-row gap-2 xl:flex-row xl:items-center">
      <div className="w-[60px]">
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <ul className="grid w-full grid-cols-10 gap-2">
        {Array.from({ length }).map((_, index) => (
          <li key={index} className="col-span-1 h-10">
            <Tooltip content={`${value}-${index * 100}`}>
              <AriaButton
                className="h-full w-full rounded-md border"
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

const AutoResizeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, className, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useControlledState(
      props.value,
      props.defaultValue ?? "",
      () => {
        // Do nothing
      }
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onWidthChange = React.useCallback(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        input.style.width = "0";
        input.style.width = `${input.scrollWidth}px`;
      }
    }, [inputRef]);

    React.useLayoutEffect(() => {
      if (inputRef.current) {
        onWidthChange();
      }
    }, [onWidthChange, inputValue, inputRef]);

    return (
      <UnstyledInput
        ref={mergeRefs(inputRef, forwardedRef)}
        onChange={chain(onChange, setInputValue)}
        className={cn(
          "border-fg min-w-[10px] border-b focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
AutoResizeInput.displayName = "AutoResizeInput";
