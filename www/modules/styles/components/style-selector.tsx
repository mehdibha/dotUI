"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { HelpText } from "@dotui/ui/components/field";
import { ListBox, ListBoxSection } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import {
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import { cn } from "@dotui/ui/lib/utils";
import type { ButtonProps } from "@dotui/ui/components/button";
import type { SelectRootProps } from "@dotui/ui/components/select";

import { useTRPC } from "@/trpc/react";

export function StyleSelector(
  props: SelectRootProps<any> & {
    buttonProps?: ButtonProps;
  },
) {
  const trpc = useTRPC();
  const { data: styles } = useSuspenseQuery(
    trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  );

  return (
    <SelectRoot selectedKey="minimalist" {...props}>
      <Button
        variant="default"
        suffix={<ChevronDownIcon />}
        {...props.buttonProps}
        className={cn("text-fg-muted", props.className)}
      >
        <SelectValue />
      </Button>
      <HelpText />
      <Popover>
        <ListBox>
          <ListBoxSection title="Featured">
            {styles.map((style) => (
              <SelectItem key={style.slug} id={style.slug}>
                {style.name}
              </SelectItem>
            ))}
          </ListBoxSection>
        </ListBox>
      </Popover>
    </SelectRoot>
  );
}
