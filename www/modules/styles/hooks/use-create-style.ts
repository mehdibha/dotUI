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

interface CreateStyleInput {
  name: string;
  preset: string;
}

export function useCreateStyle() {
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateStyleInput) => {

      const styleData: StyleDefinition = {
        name: data.name,
        description: `${data.name} style`,
        theme: DEFAULT_THEME,
        icons: {
          library: DEFAULT_ICON_LIBRARY,
          strokeWidth: DEFAULT_ICON_STROKE_WIDTH,
        },
        variants: DEFAULT_VARIANTS_DEFINITION,
      };

      // const trpc = useTRPC();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...styleData,
        id: crypto.randomUUID(),
        userId: "current-user",
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    onSuccess: (data) => {
      toast.add({
        title: "Style created successfully",
        description: `${data.name} has been created.`,
        variant: "success",
      });

      // Invalidate queries to refresh the styles list
      queryClient.invalidateQueries({
        queryKey: ["trpc", "style"],
      });

      // Navigate to the created style
      router.push(`/style/${data.slug}`);
    },
    onError: (error) => {
      toast.add({
        title: "Failed to create style",
        description:
          error.message || "An error occurred while creating the style.",
        variant: "error",
      });
    },
  });
}
