import {
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/lib/components/core/default/resizable";

export default function ResizableDemo() {
  return (
    <ResizableGroup direction="horizontal" className="max-w-md rounded-lg border">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">1</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">2</span>
        </div>
      </ResizablePanel>
    </ResizableGroup>
  );
}
