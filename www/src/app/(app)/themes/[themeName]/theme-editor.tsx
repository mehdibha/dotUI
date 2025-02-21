"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  PenIcon,
  SaveIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useMeasure } from "react-use";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Alert } from "@/components/core/alert";
import { Button } from "@/components/core/button";
import { ColorPicker } from "@/components/core/color-picker";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { Label } from "@/components/core/field";
import { MenuRoot, Menu, MenuItem } from "@/components/core/menu";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { Skeleton } from "@/components/core/skeleton";
import {
  Slider,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  type SliderProps,
} from "@/components/core/slider";
import {
  TableRoot,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/core/table";
import { ToggleButton } from "@/components/core/toggle-button";
import { Tooltip } from "@/components/core/tooltip";
import { usePreviewMode } from "@/components/mode-provider";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";
import { CreateThemeDialog } from "@/modules/themes/components/create-theme-dialog";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
import { Theme } from "@/modules/themes/types";
import { PreviewContent } from "../preview";
import { ModeSwitch } from "./mode-switch";

const ThemeEditorContext = React.createContext<{
  isLoading: boolean;
  isEditMode: boolean;
}>({
  isLoading: false,
  isEditMode: false,
});

const useThemeEditorContext = () => React.useContext(ThemeEditorContext);

export function ThemeEditor({
  theme: themeProp,
  isEditable,
}: {
  theme?: Theme | string;
  isEditable: boolean;
}) {
  const { mode: previewMode, setMode: setPreviewMode } = usePreviewMode();

  const [isEditMode, setEditMode] = React.useState(true);
  const isMounted = useMounted();
  const { userThemes } = useUserThemes();

  const theme: Theme | undefined =
    typeof themeProp === "string"
      ? userThemes.find((t) => t.name === themeProp)
      : themeProp;

  const isLoading = !theme;

  if (isMounted && !theme) {
    notFound();
  }

  return (
    <ThemeEditorContext
      value={{ isLoading, isEditMode: isEditable && isEditMode }}
    >
      <div className="[&_[data-slot=label]]:text-fg-muted">
        <ThemeEditorHeader
          theme={theme}
          isLoading={isLoading}
          isEditable={isEditable}
          isEditMode={isEditMode}
          setEditMode={setEditMode}
        />
        <ThemeEditorBody>
          {!isEditable && (
            <Alert
              action={
                <CreateThemeDialog clonedThemeName={theme?.name}>
                  <Button variant="primary">Clone theme</Button>
                </CreateThemeDialog>
              }
            >
              To adjust, edit and generate color palettes, fonts, radius,
              components and more, You need to clone the theme.
            </Alert>
          )}
          <Section
            title="Colors"
            description="Theme color palette and variations"
            action={
              theme?.foundations.light &&
              theme?.foundations.dark &&
              previewMode && (
                <ModeSwitch
                  isSelected={previewMode === "dark"}
                  onChange={(isSelected) =>
                    setPreviewMode(isSelected ? "dark" : "light")
                  }
                />
              )
            }
          >
            <ThemeColors theme={theme} />
          </Section>
          <Section title="Typography" description="Theme typography">
            <ThemeTypography />
          </Section>
          <Section title="Iconography" description="Theme iconography">
            <ThemeIconography />
          </Section>
          <Section title="Layout" description="Theme layout">
            <ThemeLayout />
          </Section>
          <Section title="Radius" description="Theme radius">
            <ThemeRadius />
          </Section>
        </ThemeEditorBody>
      </div>
    </ThemeEditorContext>
  );
}

interface ThemeHeaderProps {
  theme?: Theme;
  isLoading: boolean;
  isEditable: boolean;
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
}
export function ThemeEditorHeader({
  theme,
  isLoading,
  isEditable,
  isEditMode,
  setEditMode,
}: ThemeHeaderProps) {
  return (
    <div className="max-lg:bg-bg max-lg:sticky max-lg:top-[57px] max-lg:z-10 max-lg:border-b max-lg:p-4">
      <Link
        href="/themes"
        className="text-fg-muted hover:text-fg flex cursor-pointer items-center gap-1 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        <span>themes</span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          <Skeleton show={isLoading}>
            <span>{theme?.name ?? "Forest"}</span>
          </Skeleton>
        </h2>
        <div className="flex items-center gap-2">
          <DialogRoot>
            <Button className="xl:hidden">Preview</Button>
            <Dialog type="drawer" className="h-[80svh] p-0">
              <PreviewContent
                themeName="minimalist"
                collapsible={false}
                resizable={false}
              />
            </Dialog>
          </DialogRoot>
          {isEditable && isEditMode && (
            <Button prefix={<SaveIcon />} size="sm" isDisabled>
              Save theme
            </Button>
          )}
          {isEditable && (
            <Tooltip content="Edit mode" variant="inverse" showArrow>
              <ToggleButton
                isSelected={isEditMode}
                onChange={setEditMode}
                variant="quiet"
                shape="square"
                size="sm"
              >
                <PenIcon />
              </ToggleButton>
            </Tooltip>
          )}
          <MenuRoot>
            <Button shape="square" size="sm">
              <EllipsisVerticalIcon />
            </Button>
            <Menu>
              <MenuItem id="clone">Clone theme</MenuItem>
            </Menu>
          </MenuRoot>
        </div>
      </div>
    </div>
  );
}

function ThemeEditorBody({ children }: { children: React.ReactNode }) {
  return <div className="space-y-10 max-lg:p-4 lg:mt-12">{children}</div>;
}

interface SectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section id={title.toLowerCase().replace(" ", "-")}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className={cn("pt-2", className)}>{children}</div>
    </section>
  );
}

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

function Collapsible({
  show,
  children,
  className,
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: height, overflow: "visible" }}
            exit={{ height: 0 }}
            transition={TRANSITION}
            className={cn("overflow-hidden", className)}
          >
            <div ref={ref}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ThemeColors({ theme }: { theme?: Theme }) {
  const { isEditMode } = useThemeEditorContext();
  return (
    <div
      style={
        { "--color-secondary": "var(--color-fg-muted)" } as React.CSSProperties
      }
    >
      <Collapsible show={false}>
        <div className="box-border space-y-4 rounded-md border p-4 text-sm">
          <RadioGroup label="Theme mode" orientation="horizontal">
            {[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "both", label: "Light and dark" },
            ].map(({ value, label }) => (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
          <div className="grid grid-cols-3 gap-4">
            <Slider label="Lightness" className="w-full" />
            <Slider label="Contrast" className="w-full" />
            <Slider label="Saturation" className="w-full" />
          </div>
        </div>
      </Collapsible>
      <ThemeProvider theme={theme} unstyled>
        <p id="core-colors" className="mt-2 font-medium tracking-tight">
          Core colors
        </p>
        <Collapsible show={false}>
          <div className="py-1">
            <TableRoot
              aria-label="Core colors"
              variant="bordered"
              className="w-full"
            >
              <TableHeader>
                <TableColumn isRowHeader>Name</TableColumn>
                <TableColumn>Base color</TableColumn>
                <TableColumn className="w-full">Ratios</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Neutral</TableCell>
                  <TableCell>
                    <ColorPicker />
                  </TableCell>
                  <TableCell>
                    <RatiosSlider
                      aria-label="Ratios"
                      defaultValue={[
                        1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2,
                        15.2,
                      ]}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Accent</TableCell>
                  <TableCell>
                    <ColorPicker />
                  </TableCell>
                  <TableCell>
                    <RatiosSlider
                      aria-label="Ratios"
                      defaultValue={[
                        1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2,
                        15.2,
                      ]}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </TableRoot>
          </div>
        </Collapsible>
        <Collapsible show={!isEditMode}>
          <div className="mt-1 flex gap-1">
            <ColorItem
              colorName="Neutral"
              className="bg-bg-neutral rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
            <ColorItem
              className="bg-bg-accent rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
          </div>
        </Collapsible>
        <div className="mt-1 space-y-1">
          {[
            { name: "neutral", label: "Neutral" },
            { name: "accent", label: "Accent" },
          ].map((shade) => (
            <div key={shade.name} className="flex items-center gap-2">
              <p className="text-(--color-secondary) w-[60px] text-sm">
                {shade.label}
              </p>
              <div className="flex flex-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ColorItem
                    key={i}
                    style={{
                      backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                    }}
                    className="h-8 rounded-sm"
                    containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p id="semantic-colors" className="mt-4 font-medium tracking-tight">
          Semantic colors
        </p>
        <Collapsible show={isEditMode}>
          <div className="py-1">
            <TableRoot
              aria-label="Core colors"
              variant="bordered"
              className="w-full"
            >
              <TableHeader>
                <TableColumn isRowHeader>Name</TableColumn>
                <TableColumn>Base color</TableColumn>
                <TableColumn className="w-full">Ratios</TableColumn>
              </TableHeader>
              <TableBody>
                {[
                  { label: "Warning", name: "warning" },
                  { label: "Danger", name: "danger" },
                  { label: "Success", name: "success" },
                ].map(({ label, name }) => (
                  <TableRow key={name}>
                    <TableCell>{label}</TableCell>
                    <TableCell>
                      <ColorPicker />
                    </TableCell>
                    <TableCell>
                      <RatiosSlider
                        aria-label="Ratios"
                        defaultValue={[
                          1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2,
                          15.2,
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>
          </div>
        </Collapsible>
        <Collapsible show={!isEditMode}>
          <div className="mt-1 flex gap-1">
            {/* <Item className="bg-bg-info" /> */}
            <ColorItem
              className="bg-bg-success rounded-sm"
              containerClassName="ml-0! mr-0!"
            />
            <ColorItem
              className="bg-bg-warning rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
            <ColorItem
              className="bg-bg-danger rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
          </div>
        </Collapsible>
        <div className="mt-1 space-y-1">
          {[
            { name: "success", label: "Success" },
            { name: "warning", label: "Warning" },
            { name: "danger", label: "Danger" },
            // { name: "info", label: "Info" },
          ].map((shade) => (
            <div key={shade.name} className="flex items-center gap-2">
              <p className="text-(--color-secondary) w-[60px] text-sm">
                {shade.label}
              </p>
              <div className="flex flex-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ColorItem
                    key={i}
                    style={{
                      backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                    }}
                    className="h-8 rounded-sm"
                    containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ThemeProvider>
    </div>
  );
}

interface ColorItemProps {
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  colorValue?: string;
  colorName?: string;
}
function ColorItem({
  containerClassName,
  className,
  style,
  colorValue = "#000000",
  colorName,
}: ColorItemProps) {
  const { isLoading } = useThemeEditorContext();
  const [isCopied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Skeleton
      show={isLoading}
      className={cn(
        "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
        containerClassName
      )}
    >
      <button
        onClick={handleCopy}
        className={cn(
          "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
          containerClassName
        )}
        aria-label={`Copy ${colorName || colorValue} color value`}
      >
        <div
          className={cn(
            "hover:h-22 duration-250 group absolute bottom-0 left-0 h-12 w-full cursor-pointer overflow-hidden rounded-t-2xl transition-[height]",
            className
          )}
          style={style}
        >
          <div
            className={cn(
              "flex items-center justify-between p-2 text-sm opacity-0 transition-opacity group-hover:opacity-100",
              isCopied && "opacity-0!"
            )}
          >
            <p>{colorName || "Color"}</p>
            <p>{colorValue}</p>
          </div>
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
              isCopied && "opacity-100"
            )}
          >
            <CheckIcon className="text-fg-muted size-4" />
          </div>
        </div>
      </button>
    </Skeleton>
  );
}

function ThemeTypography() {
  return <div>typography</div>;
}

function ThemeIconography() {
  return <div>iconography</div>;
}

function ThemeLayout() {
  return <div>layout</div>;
}

function ThemeRadius() {
  return <div>radius</div>;
}

function RatiosSlider({
  label,
  defaultValue,
  minValue = 0,
  maxValue = 20,
  step = 0.1,
  className,
}: SliderProps) {
  return (
    <SliderRoot
      defaultValue={defaultValue}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      className={cn("w-full space-y-1", className)}
    >
      {label && <Label>{label}</Label>}
      <SliderTrack>
        {({ state }) => (
          <>
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} className="dragging:w-1.5 w-1">
                {({ isDragging, state }) =>
                  isDragging && (
                    <AnimatePresence>
                      <span className="relative">
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={TRANSITION}
                          className="bg-bg-muted absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-sm border p-2"
                        >
                          {state.values[i]}
                        </motion.span>
                      </span>
                    </AnimatePresence>
                  )
                }
              </SliderThumb>
            ))}
          </>
        )}
      </SliderTrack>
    </SliderRoot>
  );
}
