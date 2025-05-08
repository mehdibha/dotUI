import React from "react";
import { Components } from "@/modules/styles-2/types";

const defaultComponents: Components = {
  button: "basic",
};

export const ComponentsContext = React.createContext<{
  components: Components;
}>({ components: defaultComponents });
