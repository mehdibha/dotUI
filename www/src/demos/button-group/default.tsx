"use client";

import { Button } from "@/components/dynamic-core/button";
import { ButtonGroup } from "@/components/dynamic-core/button-group";

export default function Demo() {
  return (
    <ButtonGroup variant="outline" size="sm">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  );
}
