"use client";

import { Button } from "@/components/dynamic-core/button";
import {
  ColorEditor,
  ColorPickerRoot,
} from "@/components/dynamic-core/color-picker";
import { ColorSwatch } from "@/components/dynamic-core/color-swatch";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Drawer } from "@/registry/core/drawer_basic";
import { Modal } from "@/registry/core/modal_basic";

export default function Demo() {
  return (
    <div>
      <div data-rac="" className="not-disabled:bg-red-500 size-20"></div>
    </div>
  );
}
