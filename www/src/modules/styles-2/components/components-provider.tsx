import { Components } from "@/modules/styles-2/types";

export const ComponentsProvider = ({
  components,
  children,
}: {
  components: Components;
  children: React.ReactNode;
}) => {
  console.log(components);
  return <div>{children}</div>;
};
