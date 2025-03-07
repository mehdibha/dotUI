import React from "react";
import { CheckIcon } from "lucide-react";
import { AnimatePresence, motion, Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/core/color-picker";
import { Label } from "@/components/core/field";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import { Skeleton } from "@/components/core/skeleton";
import {
  Slider,
  SliderRoot,
  SliderTrack,
  SliderThumb,
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
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
import { Theme } from "@/modules/themes/types";
import { Collapsible } from "./collapsible";
import { useThemeEditorContext } from "./context";

export function ThemeColors({ theme }: { theme?: Theme }) {
  const { isEditMode } = useThemeEditorContext();

  return (
    <div>
      <Collapsible show={isEditMode}>
        <div className="box-border space-y-4 text-sm">
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
      <ThemeProvider theme={theme} unstyled noBaseVars createForegrounds>
        {({ colors }) => (
          <>
            <p id="core-colors" className="mt-2 font-medium tracking-tight">
              Core colors
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
                    <TableRow>
                      <TableCell>Neutral</TableCell>
                      <TableCell>
                        <ColorPicker size="sm" />
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
                        <ColorPicker size="sm" />
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
              <div className="flex gap-1 pt-1">
                <ColorItem
                  colorName="Neutral"
                  className="bg-bg-neutral rounded-sm"
                  containerClassName=" ml-0! mr-0!"
                />
                <ColorItem
                  colorName="Accent"
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
                  <p className="text-fg-muted w-[60px] text-sm">
                    {shade.label}
                  </p>
                  <div className="flex flex-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <ColorItem
                        key={i}
                        style={{
                          backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                          color: `var(--${shade.name}-${(i + 1) * 100}-fg)`,
                        }}
                        colorName={`${shade.label} ${(i + 1) * 100}`}
                        className="h-8 rounded-sm"
                        containerClassName="not-last:-mr-28 not-first:-ml-28 h-8"
                        hoverAnimation
                        colorValue={
                          colors[`--${shade.name}-${(i + 1) * 100}`]?.replace(
                            "deg",
                            ""
                          ) as string
                        }
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
                          <ColorPicker size="sm" />
                        </TableCell>
                        <TableCell>
                          <RatiosSlider
                            aria-label="Ratios"
                            defaultValue={[
                              1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28,
                              13.2, 15.2,
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
              <div className="flex gap-1 pt-1">
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
                  <p className="text-fg-muted w-[60px] text-sm">
                    {shade.label}
                  </p>
                  <div className="flex flex-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <ColorItem
                        key={i}
                        style={{
                          backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                          color: `var(--${shade.name}-${(i + 1) * 100}-fg)`,
                        }}
                        colorName={`${shade.label} ${(i + 1) * 100}`}
                        className="h-8 rounded-sm"
                        containerClassName="not-last:-mr-28 not-first:-ml-28 h-8"
                        hoverAnimation
                        colorValue={
                          colors[`--${shade.name}-${(i + 1) * 100}`]?.replace(
                            "deg",
                            ""
                          ) as string
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ThemeProvider>
    </div>
  );
}

interface ColorItemProps {
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  colorValue: string;
  colorName?: string;
  hoverAnimation?: boolean;
}
function ColorItem({
  containerClassName,
  className,
  style,
  colorValue,
  colorName,
  hoverAnimation = false,
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
            "group absolute bottom-0 left-0 h-12 w-full cursor-pointer overflow-hidden rounded-t-2xl",
            hoverAnimation &&
              "hover:h-22 duration-250 transition-[height] ease-out",
            className
          )}
          style={style}
        >
          <div
            className={cn(
              "flex items-center justify-between p-2 text-sm transition-opacity",
              hoverAnimation && "opacity-0 group-hover:opacity-100",
              !colorName && "justify-end",
              isCopied && "opacity-0!"
            )}
          >
            {colorName && <p>{colorName}</p>}
            {colorValue && <p>{colorValue}</p>}
          </div>
          <div
            className={cn(
              "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 opacity-0 transition-opacity",
              isCopied && "opacity-100"
            )}
          >
            <span className="text-sm">Copied</span>
            <CheckIcon className="size-4" />
          </div>
        </div>
      </button>
    </Skeleton>
  );
}

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

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
