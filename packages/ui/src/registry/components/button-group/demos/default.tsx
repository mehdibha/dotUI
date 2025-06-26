"use client";

import { Button } from "@dotui/ui/components/button";
import { ButtonGroup } from "@dotui/ui/components/button-group";

export default function Demo() {
  return (
    <ButtonGroup variant="outline" size="sm">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  );
}
