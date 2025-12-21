import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { DEFAULT_STYLE } from "@dotui/registry/constants";
import { toast } from "@dotui/registry/ui/toast";
import type { StyleConfig } from "@dotui/core/schemas";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/client";

interface CreateStyleInput {
	name: string;
	description?: string;
	visibility?: "public" | "unlisted" | "private";
	configOverrides?: Partial<StyleConfig>;
}

export function useCreateStyle() {
	const trpc = useTRPC();
	const trpcClient = useTRPCClient();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session } = authClient.useSession();

	return useMutation({
		mutationFn: async (data: CreateStyleInput) => {
			const config: StyleConfig = {
				theme: data.configOverrides?.theme ?? DEFAULT_STYLE.theme,
				icons: data.configOverrides?.icons ?? DEFAULT_STYLE.icons,
				variants: data.configOverrides?.variants ?? DEFAULT_STYLE.variants,
			};

			const created = await trpcClient.style.create.mutate({
				config,
				name: data.name,
				description: data.description ?? "",
				visibility: data.visibility ?? "unlisted",
			});

			return created;
		},
		onSuccess: (data) => {
			if (!data) return;
			toast.add(
				{
					title: `Style ${data.name} created. Redirecting to style page.`,
					variant: "info",
				},
				{
					timeout: 5000,
				},
			);

			// Invalidate queries to refresh the styles list
			queryClient.invalidateQueries({
				queryKey: trpc.style.getMyStyles.queryKey(),
			});

			// Navigate to the created style page
			const username = session?.user?.username ?? "me";
			router.push(`/styles/${username}/${data.name}`);
		},
	});
}
