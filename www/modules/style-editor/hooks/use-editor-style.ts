import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";
import { useStyleEditorParams } from "./use-style-editor-params";

export const useEditorStyle = () => {
  const { username, style: styleName } = useStyleEditorParams();

  const trpc = useTRPC();
  return useQuery(
    trpc.style.getByNameAndUsername.queryOptions({
      name: styleName,
      username,
    }),
  );
};
