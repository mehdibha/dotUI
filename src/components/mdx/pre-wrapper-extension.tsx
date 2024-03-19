import { Code, type BrightProps, type Extension } from "bright";
import { CopyButton } from "../copy-button";
import { ScrollArea } from "../ui/scroll-area";

export const preWrapper: Extension = {
  name: "preWrapper",
  Pre: (props: BrightProps) => {
    const { code } = props;
    return (
      <div className="relative">
        <CopyButton code={code} className="absolute right-4 top-2 z-50" />
        <ScrollArea viewportProps={{ className: "max-h-[350px]" }}>
          {/* @ts-expect-error TODO: fix later */}
          <Code.Pre {...props} />
        </ScrollArea>
      </div>
    );
  },
};
