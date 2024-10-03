"use client";

import * as React from "react";
import { ALargeSmallIcon, RotateCwIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { Input, InputRoot } from "@/registry/ui/default/core/input";
import { Progress } from "@/registry/ui/default/core/progress";
import { TextFieldRoot } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  const [key, setKey] = React.useState(0);
  const refresh = () => setKey((key) => key + 1);
  return (
    <TextFieldRoot key={key} defaultValue="https://dotui.org">
      <InputRoot className="relative h-10 overflow-hidden px-1 pb-0.5">
        <Button size="sm" variant="quiet" shape="square" className="size-7">
          <ALargeSmallIcon />
        </Button>
        <Input className="text-center" />
        <Button
          onPress={refresh}
          size="sm"
          variant="quiet"
          shape="square"
          className="size-7"
        >
          <RotateCwIcon />
        </Button>
        <Progress
          value={50}
          size="sm"
          variant="accent"
          duration="5s"
          className="absolute bottom-0 left-0 right-0"
        />
      </InputRoot>
    </TextFieldRoot>
  );
}
