import {
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/lib/components/core/default/resizable";

export default function ResizableDemo() {
  return (
    <ResizableGroup direction="vertical" className="min-h-96 max-w-md rounded-lg border">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizableGroup>
  );
}
