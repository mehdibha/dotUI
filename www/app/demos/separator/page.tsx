import { Separator } from "@dotui/registry/ui/separator";

export default function Page() {
  return (
    <div className="w-64">
      <div>Section 1</div>
      <Separator orientation="horizontal" className="my-4" />
      <div>Section 2</div>
    </div>
  );
}

