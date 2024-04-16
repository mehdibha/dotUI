import { UploadIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";

export default function ButtonDemo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button prefix={<UploadIcon />} size="sm">
        Upload
      </Button>
      <Button prefix={<UploadIcon />}>Upload</Button>
      <Button suffix={<UploadIcon />}>Upload</Button>
      <Button prefix={<UploadIcon />} suffix={<UploadIcon />}>
        Upload
      </Button>
      <Button prefix={<UploadIcon />} size="lg">
        Upload
      </Button>
    </div>
  );
}
