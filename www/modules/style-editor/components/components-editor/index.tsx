"use client";

import React from "react";

import { BadgeAndTagGroup } from "./demos/badge-and-tag-group";
import { Buttons } from "./demos/buttons";
import { Calendars } from "./demos/calendars";
import { Checkboxes } from "./demos/checkboxes";
import { FocusStyles } from "./demos/focus-styles";
import { Inputs } from "./demos/inputs";
import { ListBoxAndMenu } from "./demos/list-box-and-menu";
import { Loaders } from "./demos/loaders";
import { Overlays } from "./demos/overlays";
import { Pickers } from "./demos/pickers";
import { Radios } from "./demos/radios";
import { Selection } from "./demos/selection";
import { Sliders } from "./demos/slider";
import { Switches } from "./demos/switch";
import { Tooltips } from "./demos/tooltip";

export function ComponentsEditor() {
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (isPending) {
      setTimeout(() => setIsPending(false), 2000);
    }
  }, [isPending]);

  return (
    <div>
      <Loaders />
      <Buttons />
      <FocusStyles />
      <Inputs />
      <Pickers />
      <Selection />
      <Calendars />
      <ListBoxAndMenu />
      <Overlays />
      <Checkboxes />
      <Radios />
      <Switches />
      <Sliders />
      <BadgeAndTagGroup />
      <Tooltips />
    </div>
  );
}
