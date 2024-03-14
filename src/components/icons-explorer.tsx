import React from "react";
// import { transform } from "@svgr/core";
import { SearchIcon } from "lucide-react";
import * as icons from "lucide-static";
// import { FixedSizeList as List } from "react-window";
// import { IconWrapper } from "./icon-wrapper";
import { IconsList } from "./icons-list";
import { Input } from "./ui/input";

export const IconsExplorer = () => {
  // const jsCode = await transform(
  //   svgCode,
  //   { icon: true },
  //   { componentName: 'MyComponent' },
  // )
  return (
    <div>
      <div className="relative">
        <Input className="w-full pl-12" placeholder={`Search icons`} />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
      <div className="h-full min-h-[100px]">
        <IconsList
          icons={Object.entries(icons).map(([key, value]) => ({ key, value }))}
        />
      </div>
    </div>
  );
};
