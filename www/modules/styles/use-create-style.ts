import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { DEFAULT_THEME } from "@dotui/registry/constants";
import { toast } from "@dotui/registry/ui/toast";
import {
	DEFAULT_ICON_LIBRARY,
	DEFAULT_ICON_STROKE_WIDTH,
	DEFAULT_VARIANTS_DEFINITION,
} from "@dotui/style-system/utils";
import type { StyleDefinition } from "@dotui/style-system/types";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/client";

interface CreateStyleInput {
	name: string;
	description?: string;
	visibility?: "public" | "unlisted" | "private";
	styleOverrides?: Partial<StyleDefinition>;
}

export function useCreateStyle() {
	const trpc = useTRPC();
	const trpcClient = useTRPCClient();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session } = authClient.useSession();

	return useMutation({
		mutationFn: async (data: CreateStyleInput) => {
			const styleData: StyleDefinition = {
				theme: data.styleOverrides?.theme ?? DEFAULT_THEME,
				icons: {
					library: data.styleOverrides?.icons?.library ?? DEFAULT_ICON_LIBRARY,
					strokeWidth: data.styleOverrides?.icons?.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH,
				},
				variants: data.styleOverrides?.variants ?? DEFAULT_VARIANTS_DEFINITION,
			};

			// Cast to expected schema types - StyleDefinition uses generic strings while
			// the database schema expects specific literal union types from zod
			const created = await trpcClient.style.create.mutate({
				theme: styleData.theme as Parameters<typeof trpcClient.style.create.mutate>[0]["theme"],
				icons: styleData.icons as Parameters<typeof trpcClient.style.create.mutate>[0]["icons"],
				variants: styleData.variants as Parameters<typeof trpcClient.style.create.mutate>[0]["variants"],
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
