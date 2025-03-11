import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button prefix={<UploadIcon />}>Upload</Button>
      <Button suffix={<UploadIcon />}>Upload</Button>
    </div>
  );
}
