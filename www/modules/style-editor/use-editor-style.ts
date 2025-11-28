import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";

import { useStyleEditorParams } from "./use-style-editor-params";

export const useEditorStyle = () => {
  const { slug } = useStyleEditorParams();

  const trpc = useTRPC();
  return useQuery(trpc.style.getBySlug.queryOptions({ slug }));
};
