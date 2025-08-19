"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@dotui/ui/components/toast";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import type { StyleFormData } from "./schema";

export function useSaveStyle(params: {
	styleId: string;
	styleName: string;
	username: string;
}) {
	const { styleId, styleName, username } = params;
	const trpc = useTRPC();
	const trpcClient = useTRPCClient();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: StyleFormData) => {
			if (!styleId) throw new Error("Missing style id");
			return await trpcClient.style.update.mutate({
				id: styleId,
				theme: data.theme,
				icons: data.icons,
				variants: data.variants,
			});
		},
		onMutate: async (variables: StyleFormData) => {
			const queryKey = trpc.style.getByNameAndUsername.queryKey({
				name: styleName,
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
		onError: (_error: unknown, _variables, context) => {
			if (context?.previousStyle) {
				queryClient.setQueryData(context.queryKey, context.previousStyle);
			}
			toast.add({ title: "Failed to update style", variant: "danger" });
		},
		onSuccess: (updated: any) => {
			const queryKey = trpc.style.getByNameAndUsername.queryKey({
				name: styleName,
				username,
			});
			queryClient.setQueryData(queryKey, updated);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: trpc.style.getByNameAndUsername.queryKey({
					name: styleName,
					username,
				}),
			});
		},
	});

	return mutation;
}

