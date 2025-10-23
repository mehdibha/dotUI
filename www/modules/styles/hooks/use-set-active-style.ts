import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";

export function useSetActiveStyle() {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { styleId: string }) => {
      return await trpcClient.style.setActive.mutate(variables);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: trpc.style.getActive.queryKey(),
      });
      const previousStyle = queryClient.getQueryData(
        trpc.style.getActive.queryKey(),
      );
      queryClient.setQueryData(
        trpc.style.getActive.queryKey(),
        variables.styleId,
      );
      return { previousStyle, newStyle: variables.styleId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousStyle !== undefined) {
        queryClient.setQueryData(
          trpc.style.getActive.queryKey(),
          context.previousStyle,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.style.getActive.queryKey(),
      });
    },
  });
}
