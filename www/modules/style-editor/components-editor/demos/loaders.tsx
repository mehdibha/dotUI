"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { Loader } from "@dotui/registry/ui/loader";

import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components-editor/section";

export function Loaders() {
  const [isPending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!isPending) return;

    const timeout = setTimeout(() => {
      setPending(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isPending]);

  return (
    <Section
      name="loader"
      title="Loaders"
      variants={getComponentVariants("loader")}
      previewClassName="gap-4"
    >
      <Loader />
      <Button isPending>Button</Button>
      <Button
        variant="primary"
        isPending={isPending}
        onPress={() => setPending(true)}
      >
        Click me
      </Button>
    </Section>
  );
}
