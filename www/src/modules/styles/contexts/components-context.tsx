import React from "react";
import { DEFAULT_COMPONENTS } from "@/modules/styles/constants/defaults";
import { Components } from "@/modules/styles/types";

const ComponentsContext = React.createContext<{
  components: Components;
}>({ components: DEFAULT_COMPONENTS });

export const ComponentsProvider = ({
  components,
  children,
}: {
  components: Components;
  children: React.ReactNode;
}) => {
  return (
    <ComponentsContext.Provider value={{ components }}>
      {children}
    </ComponentsContext.Provider>
  );
};

export const useCurrentComponents = () => {
  const ctx = React.use(ComponentsContext);
  if (!ctx)
    throw new Error(
      "useCurrentComponents must be used within ComponentsContext",
    );
  return ctx.components;
};
