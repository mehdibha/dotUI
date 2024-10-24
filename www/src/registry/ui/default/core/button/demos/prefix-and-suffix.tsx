import { Button } from "@/registry/ui/default/core/button";
import { UploadIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button prefix={<UploadIcon />}>Upload</Button>
      <Button suffix={<UploadIcon />}>Upload</Button>
    </div>
  );
}
