import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DEFAULT_ICON_LIBRARY,
  DEFAULT_ICON_STROKE_WIDTH,
  DEFAULT_THEME,
  DEFAULT_VARIANTS_DEFINITION,
} from "@dotui/style-engine/constants";
import { toast } from "@dotui/ui/components/toast";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useTRPCClient } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";

interface CreateStyleInput {
  name: string;
  description?: string;
  visibility?: "public" | "unlisted" | "private";
  styleOverrides?: Partial<StyleDefinition>;
}

export function useCreateStyle() {
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
          strokeWidth:
            data.styleOverrides?.icons?.strokeWidth ??
            DEFAULT_ICON_STROKE_WIDTH,
        },
        variants: data.styleOverrides?.variants ?? DEFAULT_VARIANTS_DEFINITION,
      };

      const created = await trpcClient.style.create.mutate({
        ...styleData,
        name: data.name,
        description: data.description ?? "",
        visibility: data.visibility ?? "unlisted",
      } as any);

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
        queryKey: ["trpc", "style"],
      });

      // Navigate to the created style page
      const username = session?.user?.username ?? "me";
      router.push(`/styles/${username}/${data.name}`);
    },
  });
}
