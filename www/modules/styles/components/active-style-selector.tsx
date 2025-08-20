"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { ButtonProps } from "@dotui/ui/components/button";
import type { SelectRootProps } from "@dotui/ui/components/select";

import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";
import { useFeaturedStyles } from "@/modules/styles/hooks/use-featured-styles";
import { useMyStyles } from "@/modules/styles/hooks/use-my-styles";
import { useSetActiveStyle } from "../hooks/use-set-active-style";

export function ActiveStyleSelector(
  props: SelectRootProps<any> & {
    buttonProps?: ButtonProps;
  },
) {
  const activeStyleQuery = useActiveStyle();
  const featuredStylesQuery = useFeaturedStyles();
  const myStylesQuery = useMyStyles();
  const updateStyleMutation = useSetActiveStyle();

  return (
    <SelectRoot
      selectedKey={activeStyleQuery.data?.id}
      onSelectionChange={(key) => {
        updateStyleMutation.mutate({
          styleId: key as string,
        });
      }}
      {...props}
    >
      <Button
        variant="default"
        suffix={<ChevronDownIcon />}
        {...props.buttonProps}
      >
        <span className="text-fg-muted">Style:</span>{" "}
        {activeStyleQuery.isPending ? <span>loading...</span> : <SelectValue />}
      </Button>
      <HelpText />
      <Popover>
        <ListBox isLoading={featuredStylesQuery.isPending || myStylesQuery.isPending}>
          {myStylesQuery.isSuccess && myStylesQuery.data?.length ? (
            <ListBoxSection title="My styles">
              {myStylesQuery.data?.map((style) => (
                <SelectItem key={style.id} id={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </ListBoxSection>
          ) : null}
          <ListBoxSection title="Featured">
            {featuredStylesQuery.isSuccess &&
              featuredStylesQuery.data?.map((style) => (
                <SelectItem key={style.id} id={style.id}>
                  {style.name}
                </SelectItem>
              ))}
          </ListBoxSection>
        </ListBox>
      </Popover>
    </SelectRoot>
  );
}
