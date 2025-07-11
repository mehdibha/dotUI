"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";

import { Session } from "@dotui/auth";
import { Button } from "@dotui/ui/components/button";
import { HelpText } from "@dotui/ui/components/field";
import { ListBox, ListBoxSection } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import {
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import type { ButtonProps } from "@dotui/ui/components/button";
import type { SelectRootProps } from "@dotui/ui/components/select";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";

export function StyleSelector(
  props: SelectRootProps<any> & {
    buttonProps?: ButtonProps;
  },
) {
  const isMounted = useMounted();
  const trpc = useTRPC();
  const { data: styles } = useQuery({
    ...trpc.style.all.queryOptions({
      isFeatured: true,
    }),
    enabled: isMounted,
  });

  const { data } = authClient.useSession();

  if (!isMounted || !styles) {
    return (
      <Button
        variant="default"
        suffix={<ChevronDownIcon />}
        {...props.buttonProps}
      >
        <span className="text-fg-muted">Style:</span> Loading...
      </Button>
    );
  }

  return (
    <SelectRoot
      selectedKey={data?.user.selectedStyle}
      onSelectionChange={(key) => {
        authClient.updateUser({
          selectedStyle: key as string,
        });
      }}
      {...props}
    >
      <Button
        variant="default"
        suffix={<ChevronDownIcon />}
        {...props.buttonProps}
      >
        <span className="text-fg-muted">Style:</span> <SelectValue />
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
