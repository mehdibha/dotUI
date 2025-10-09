"use client";

import { ChevronDownIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { ListBox, ListBoxSection } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { SelectItem, SelectRoot, SelectValue } from "@dotui/registry/ui/select";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { SelectRootProps } from "@dotui/registry/ui/select";

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
      aria-label="Active Style"
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
        className={cn(props.buttonProps?.className, "justify-start")}
      >
        <span className="text-fg-muted">Style:</span>{" "}
        {activeStyleQuery.isPending ? (
          <span className="flex-1 truncate text-left">loading...</span>
        ) : (
          <span className="flex-1 truncate text-left">
            <SelectValue />
          </span>
        )}
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
