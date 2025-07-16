import { Button } from "@dotui/ui/components/button";
import { UploadIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button prefix={<UploadIcon />}>Upload</Button>
      <Button suffix={<UploadIcon />}>Upload</Button>
    </div>
  );
}
