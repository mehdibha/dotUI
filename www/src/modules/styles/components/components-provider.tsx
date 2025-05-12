import { ComponentsContext } from "@/modules/styles/contexts/components-context";
import { Components } from "@/modules/styles/types";

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
