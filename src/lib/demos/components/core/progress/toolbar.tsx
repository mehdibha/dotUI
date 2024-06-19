"use client";

import * as React from "react";
import { ALargeSmallIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Input, InputWrapper } from "@/lib/components/core/default/input";
import { Progress } from "@/lib/components/core/default/progress";
import { TextField, TextFieldRoot } from "@/lib/components/core/default/text-field";

export default function Demo() {
  const [key, setKey] = React.useState(0);
  const refresh = () => setKey((key) => key + 1);
  return (
    <TextFieldRoot key={key} defaultValue="https://rcopy.dev">
      <InputWrapper className="relative overflow-hidden pb-0.5 px-1 h-10">
        <Button size="sm" variant="quiet" shape="square" className="size-7">
          <ALargeSmallIcon />
        </Button>
        <Input className="text-center" />
        <Button onPress={refresh} size="sm" variant="quiet" shape="square" className="size-7">
          <RotateCwIcon />
        </Button>
        <Progress
          value={50}
          size="sm"
          variant="accent"
          duration="5s"
          className="absolute bottom-0 left-0 right-0"
        />
      </InputWrapper>
    </TextFieldRoot>
  );
}
