import { TextArea } from "@/lib/components/core/default/text-area";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextArea variant="success" label="Success" />
      <TextArea variant="warning" label="Warning" />
      <TextArea variant="danger" label="Danger" />
    </div>
  );
}
