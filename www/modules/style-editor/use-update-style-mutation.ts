import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import type { StyleFormData } from "@/modules/style-editor/style-editor-provider";

export const useUpdateStyleMutation = (
	{ styleId, slug }: { styleId?: string; slug?: string },

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
			if (!styleId || !slug) throw new Error("Missing style id or slug");
			return await trpcClient.style.update.mutate({
				id: styleId,
				theme: data.theme,
				icons: data.icons,
				variants: data.variants,
			});
		},
		onMutate: async (variables: StyleFormData) => {
			const queryKey = trpc.style.getBySlug.queryKey({ slug: slug! });

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
			const queryKey = trpc.style.getBySlug.queryKey({ slug: slug });
			// Merge with existing data to preserve user info
			queryClient.setQueryData(queryKey, (old: any) => {
				if (!old) return updated;
				return { ...old, ...updated };
			});
			if (updated) {
				callbacks?.onSuccess?.(updated as unknown as StyleFormData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: trpc.style.getBySlug.queryKey({ slug: slug! }),
			});
		},
	});
};
