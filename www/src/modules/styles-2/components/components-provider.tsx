import { Components } from "@/modules/styles-2/types";

export const ComponentsProvider = ({
  components,
  children,
}: {
  components: Components;
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};
