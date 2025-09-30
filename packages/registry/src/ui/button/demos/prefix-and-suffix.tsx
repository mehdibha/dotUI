import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button prefix={<UploadIcon />}>Upload</Button>
      <Button suffix={<UploadIcon />}>Upload</Button>
    </div>
  );
}
