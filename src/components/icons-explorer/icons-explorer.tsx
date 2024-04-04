import React from "react";
import type { Library } from "@/types/icons";
import IconsList from "./icons-list";

interface IconsExplorerProps {
  libraries: Library[];
}

export const IconsExplorer = (props: IconsExplorerProps) => {
  const { libraries } = props;

  return <IconsList libraries={libraries} className="mt-4" />;
};
