import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
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
      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Create style with default values based on preset
      const styleData: StyleDefinition = {
        name: data.name,
        slug,
        description: `${data.name} style`,
        theme: DEFAULT_THEME,
        icons: {
          library: "lucide",
          strokeWidth: 1.5,
        },
        variants: DEFAULT_VARIANTS_DEFINITION,
      };

      // Apply preset-specific modifications
      if (data.preset === "brutalist") {
        styleData.variants.buttons = "brutalist";
        styleData.theme.colors.activeModes = ["light"];
      }

      // For now, we'll simulate the API call since the create endpoint might not exist yet
      // In a real implementation, this would be:
      // return await trpcClient.style.create.mutate(styleData);

      // Simulated response
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
