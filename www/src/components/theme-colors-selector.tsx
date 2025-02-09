"use client";

import React from "react";
import { parseColor, type Color } from "react-aria-components";
import { Button } from "@/components/core/button";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/core/color-swatch-picker";
import { Dialog, DialogRoot } from "@/components/core/dialog";

export const ThemeColorsSelector = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [accentColor, setAccentColor] = React.useState<{
    name: "";
    value: Color;
  }>({
    name: "",
    value: parseColor("#f9a825"),
  });
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);

  return (
    <DialogRoot>
      {children}
      <Dialog
        type="popover"
        popoverProps={{ placement: "bottom right", shouldFlip: false }}
      >
        <p className="text-fg-muted text-sm">Neutral</p>
        <ColorSwatchPicker
          value={accentColor.value}
          className="grid grid-cols-5"
        >
          {neutralColors.map((color) => (
            <ColorSwatchPickerItem key={color.name} color={color.color}>
              {color.name}
            </ColorSwatchPickerItem>
          ))}
        </ColorSwatchPicker>
        <p className="text-fg-muted mt-4 text-sm">Primary</p>
        <ColorSwatchPicker className="grid grid-cols-5">
          {accentColors.map((color) => (
            <ColorSwatchPickerItem key={color.name} color={color.color}>
              {color.name}
            </ColorSwatchPickerItem>
          ))}
          {/* <ColorSwatchPickerItem color=  /> */}
        </ColorSwatchPicker>
      </Dialog>
    </DialogRoot>
  );
};

const neutralColors = [
  {
    name: "slate",
    color: "#1f2937",
  },
  {
    name: "gray",
    color: "#f4f4f4",
  },
  {
    name: "zinc",
    color: "#f9f9f9",
  },
  {
    name: "neutral",
    color: "#f5f5f5",
  },
  {
    name: "stone",
    color: "#f5f5f5",
  },
];

const accentColors = [
  {
    name: "Orange",
    color: "#f9a825",
  },
  {
    name: "Green",
    color: "#43a047",
  },
  {
    name: "Blue",
    color: "#1e88e5",
  },
  {
    name: "Red",
    color: "#e53935",
  },
  {
    name: "Purple",
    color: "#8e24aa",
  },
  {
    name: "Yellow",
    color: "#fdd835",
  },
  {
    name: "Pink",
    color: "#e91e63",
  },
  {
    name: "Cyan",
    color: "#00acc1",
  },
  {
    name: "Teal",
    color: "#00897b",
  },
  {
    name: "Indigo",
    color: "#3949ab",
  },
  {
    name: "Lime",
    color: "#cddc39",
  },
  {
    name: "Amber",
    color: "#ffc107",
  },
  {
    name: "Deep Orange",
    color: "#ff5722",
  },
  {
    name: "Deep Purple",
    color: "#673ab7",
  },
  {
    name: "Light Blue",
    color: "#03a9f4",
  },
  {
    name: "Light Green",
    color: "#8bc34a",
  },
  {
    name: "Brown",
    color: "#795548",
  },
  {
    name: "Blue Gray",
    color: "#607d8b",
  },
  {
    name: "Black",
    color: "#000000",
  },
  {
    name: "White",
    color: "#ffffff",
  },
];
