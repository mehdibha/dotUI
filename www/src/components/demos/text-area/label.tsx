import { TextArea } from "@/components/dynamic-core/text-area";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextArea label="Description" placeholder="Visible label" />
      <TextArea aria-label="Description" placeholder="Hidden label" />
    </div>
  );
}
