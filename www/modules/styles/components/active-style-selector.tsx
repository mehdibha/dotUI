"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
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
import { useSetActiveStyle } from "@/modules/styles/hooks/use-set-active-style";
import { useUserStyles } from "@/modules/styles/hooks/use-user-styles";

export function ActiveStyleSelector(
  props: SelectRootProps<any> & {
    buttonProps?: ButtonProps;
  },
) {
  const activeStyleQuery = useActiveStyle();
  const updateStyleMutation = useSetActiveStyle();

  const featuredStylesQuery = useFeaturedStyles();
  const userStylesQuery = useUserStyles();

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
      <Popover>
        <ListBox isLoading={featuredStylesQuery.isPending}>
          {userStylesQuery.isSuccess && userStylesQuery.data?.length > 0 && (
            <ListBoxSection title="My styles">
              {userStylesQuery.data
                ?.filter((style) => !style.isFeatured)
                .map((style) => (
                  <SelectItem key={style.id} id={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
            </ListBoxSection>
          )}
          {featuredStylesQuery.isSuccess &&
            featuredStylesQuery.data?.length > 0 && (
              <ListBoxSection title="Featured">
                {featuredStylesQuery.data?.map((style) => (
                  <SelectItem key={style.id} id={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </ListBoxSection>
            )}
        </ListBox>
      </Popover>
    </SelectRoot>
  );
}
