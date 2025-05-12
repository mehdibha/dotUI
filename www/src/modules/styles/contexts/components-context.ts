import React from "react";
import { Components } from "@/modules/styles/types";

const defaultComponents: Components = {
  button: "basic",
};

export const ComponentsContext = React.createContext<{
  components: Components;
}>({ components: defaultComponents });
