import React from "react";
import { Primitives } from "@dotui/schemas";

const PrimitivesContext = React.createContext<{
  primitives: Primitives;
}>({ primitives: {} });

export const PrimitivesProvider = ({
  primitives,
  children,
}: {
  primitives?: Primitives;
  children?: React.ReactNode;
}) => {
  return (
    <PrimitivesContext.Provider
      value={{ primitives: { ...defaultPrimitives, ...primitives } }}
    >
      {children}
    </PrimitivesContext.Provider>
  );
};

export const useLocalPrimitives = () => React.useContext(PrimitivesContext);

const defaultPrimitives: Primitives = {
  button: "basic",
};
