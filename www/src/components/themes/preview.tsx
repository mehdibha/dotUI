"use client";

import React from "react";
import { motion } from "framer-motion";
import { Maximize2Icon, PinIcon, SmartphoneIcon } from "lucide-react";
import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";
import * as icons from "@/__icons__";

const transitionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const Preview = ({ currentSection }: { currentSection: string }) => {
  return (
    <motion.div
      layout
      className="overflow-hidden rounded-lg border"
      // transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <div className="bg-bg-muted flex h-10 items-center justify-between pl-4 pr-2">
        <p className="text-fg-muted text-sm">Preview</p>
        <div className="flex items-center gap-2">
          <Button variant="quiet" shape="square" size="sm">
            <Maximize2Icon />
          </Button>
          <Button variant="quiet" shape="square" size="sm">
            <SmartphoneIcon />
          </Button>
        </div>
      </div>
      <div className="p-6">
        {currentSection === "color-neutral" && (
          <ColorPreview color="neutral" showBackground />
        )}
        {currentSection === "color-success" && <ColorPreview color="success" />}
        {currentSection === "color-warning" && <ColorPreview color="warning" />}
        {currentSection === "color-danger" && <ColorPreview color="danger" />}
        {currentSection === "color-accent" && <ColorPreview color="accent" />}
        {currentSection === "colors" && (
          <motion.div
            key={0}
            className="grid grid-cols-2 gap-2"
            {...transitionProps}
          >
            <MotionButton layout>Button 1</MotionButton>
            <MotionButton layout>Button 2</MotionButton>
            <MotionButton layout>Button 3</MotionButton>
            <MotionButton layout>Button 5</MotionButton>
          </motion.div>
        )}
        {currentSection === "typography" && (
          <motion.div key={1} {...transitionProps}>
            <motion.p layout className="text-4xl font-bold">
              Heading
            </motion.p>
            <motion.p layout className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </motion.p>
          </motion.div>
        )}
        {currentSection === "icons" && (
          <motion.div
            key={2}
            className="grid grid-cols-8 gap-4"
            {...transitionProps}
          >
            {Object.entries(icons).map(([key, Icon]) => {
              const MotionIcon = motion.create(Icon);
              return (
                <MotionIcon key={`icon-${key}`} layout className="size-5" />
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const MotionButton = motion.create(Button);
const MotionToggleButton = motion.create(ToggleButton);
const MotionAlert = motion.create(Alert);

const ColorPreview = ({
  color,
  showBackground,
}: {
  color: "neutral" | "success" | "warning" | "danger" | "accent";
  showBackground?: boolean;
}) => {
  return (
    <motion.div>
      {showBackground && (
        <div className="bg-bg flex h-[300px] w-[500px] flex-row border">
          <div className="flex h-[50%] items-center justify-center border-r md:h-[100%] md:w-[50%]">
            <div className="bg-bg relative flex size-40 items-center justify-center rounded-[12px] border">
              <div className="bg-bg-muted text-fg-muted flex size-6 items-center justify-center rounded-full text-xs">
                1
              </div>
              <div className="bg-bg-muted text-fg-muted absolute -bottom-10 flex size-6 items-center justify-center rounded-full text-xs">
                2
              </div>
            </div>
          </div>
          <div className="bg-bg-muted flex h-[50%] items-center justify-center border-r border-t md:h-[100%] md:w-[50%] md:border-none">
            <div className="bg-bg relative flex size-40 items-center justify-center rounded-[12px] border">
              <div className="bg-bg-muted text-fg-muted flex size-6 items-center justify-center rounded-full text-xs">
                1
              </div>
              <div className="bg-bg text-fg-muted absolute -bottom-10 flex size-6 items-center justify-center rounded-full text-xs">
                2
              </div>
            </div>
          </div>
        </div>
      )}
      <motion.div
        layoutId="color-preview-buttons"
        className="mt-6 flex items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <MotionButton variant="default" layoutId="button-default">
            default
          </MotionButton>
          {color === "neutral" ? (
            <MotionButton variant="primary" layoutId="button-primary">
              primary
            </MotionButton>
          ) : (
            <MotionButton variant={color} layoutId="button-primary">
              primary
            </MotionButton>
          )}
          <MotionButton variant="outline" layoutId="button-outline">
            outline
          </MotionButton>
          <MotionButton variant="quiet" layoutId="button-quiet">
            quiet
          </MotionButton>
        </div>
        {color === "neutral" && (
          <div className="flex items-center gap-2">
            <MotionToggleButton
              variant="quiet"
              defaultSelected
              layoutId="toggle-quiet"
            >
              <PinIcon />
            </MotionToggleButton>
            <MotionToggleButton variant="outline" layoutId="toggle-outline">
              <PinIcon />
            </MotionToggleButton>
          </div>
        )}
      </motion.div>
      <div className="mt-6">
        <MotionAlert
          fill
          layoutId="color-preview-alert"
          variant={
            color === "neutral"
              ? "default"
              : color === "accent"
                ? "info"
                : color
          }
        >
          This is an important message!
        </MotionAlert>
      </div>
    </motion.div>
  );
};
