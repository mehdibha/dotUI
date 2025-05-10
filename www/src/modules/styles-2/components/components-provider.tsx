import { ComponentsContext } from "@/modules/styles-2/contexts/components-context";
import { Components } from "@/modules/styles-2/types";

export const ComponentsProvider = ({
  components,
  children,
}: {
  components: Components;
  children: React.ReactNode;
}) => {
  return (
    <ComponentsContext value={{ components }}>{children}</ComponentsContext>
  );
};
