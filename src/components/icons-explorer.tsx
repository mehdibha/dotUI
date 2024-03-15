import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon, SearchIcon } from "lucide-react";
import type { Library } from "@/types/icons";
import { Input } from "./ui/input";

const IconsList = dynamic(() => import("./icons-list"), {
  loading: () => (
    <div>
      <div className="relative">
        <Input className="w-full pl-12" placeholder={`Search icons`} />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
      <div className="flex justify-center mt-20">
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  ),
  ssr: false,
});

interface IconsExplorerProps {
  libraries: Library[];
}

export const IconsExplorer = (props: IconsExplorerProps) => {
  const { libraries } = props;

  return <IconsList libraries={libraries} className="mt-4" />;
};
