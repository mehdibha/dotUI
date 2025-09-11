import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StyleFormData } from "@/modules/style-editor/context/style-editor-provider";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";

export const useUpdateStyleMutation = (
  {
    styleId,
    name,
    username,
  }: { styleId?: string; name?: string; username?: string },

  callbacks?: {
    onSuccess?: (data: StyleFormData) => void;
    onError?: (error: unknown) => void;
  },
) => {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StyleFormData) => {
      if (!styleId || !name || !username) throw new Error("Missing style id");
      return await trpcClient.style.update.mutate({
        id: styleId,
        theme: data.theme,
        icons: data.icons,
        variants: data.variants,
      });
    },
    onMutate: async (variables: StyleFormData) => {
      const queryKey = trpc.style.getByNameAndUsername.queryKey({
        name,
        username,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousStyle = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          theme: variables.theme,
          icons: variables.icons,
          variants: variables.variants,
          updatedAt: new Date(),
        };
      });

      return { previousStyle, queryKey } as const;
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousStyle) {
        queryClient.setQueryData(context.queryKey, context.previousStyle);
      }
      callbacks?.onError?.(error);
    },
    onSuccess: (updated) => {
      const queryKey = trpc.style.getByNameAndUsername.queryKey({
        name,
        username,
      });
      queryClient.setQueryData(queryKey, updated);
      if (updated) {
        callbacks?.onSuccess?.(updated);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.style.getByNameAndUsername.queryKey({
          name,
          username,
        }),
      });
    },
  });
};
