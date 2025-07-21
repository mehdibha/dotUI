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
import { Skeleton } from "@dotui/ui/components/skeleton";
import type { ButtonProps } from "@dotui/ui/components/button";
import type { SelectRootProps } from "@dotui/ui/components/select";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC, useTRPCClient } from "@/lib/trpc/react";

export function StyleSelector(
  props: SelectRootProps<any> & {
    buttonProps?: ButtonProps;
  },
) {
  const isMounted = useMounted();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const {
    data: styles,
    isLoading,
    isSuccess,
  } = useQuery({
    ...trpc.style.all.queryOptions({
      isFeatured: true,
    }),
    enabled: isMounted,
  });

  const { data: currentStyle } = useQuery({
    ...trpc.style.getCurrentStyle.queryOptions(),
    enabled: isMounted,
  });

  const updateStyleMutation = useMutation({
    mutationFn: async (variables: { styleId: string }) => {
      return await trpcClient.style.updateCurrentStyle.mutate(variables);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: trpc.style.getCurrentStyle.queryKey(),
      });
      const previousStyle = queryClient.getQueryData(
        trpc.style.getCurrentStyle.queryKey(),
      );
      queryClient.setQueryData(
        trpc.style.getCurrentStyle.queryKey(),
        variables.styleId,
      );
      return { previousStyle, newStyle: variables.styleId };
    },
    onError: (err, variables, context) => {
      if (context?.previousStyle !== undefined) {
        queryClient.setQueryData(
          trpc.style.getCurrentStyle.queryKey(),
          context.previousStyle,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.style.getCurrentStyle.queryKey(),
      });
    },
  });

  return (
    <Skeleton show={isLoading}>
      <SelectRoot
        selectedKey={currentStyle}
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
          <span className="text-fg-muted">Style:</span> <SelectValue />
        </Button>
        <HelpText />
        <Popover>
          <ListBox isLoading={isLoading}>
            <ListBoxSection title="Featured">
              {isSuccess &&
                styles.map((style) => (
                  <SelectItem key={style.slug} id={style.slug}>
                    {style.name}
                  </SelectItem>
                ))}
            </ListBoxSection>
          </ListBox>
        </Popover>
      </SelectRoot>
    </Skeleton>
  );
}
