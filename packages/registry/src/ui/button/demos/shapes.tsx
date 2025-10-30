import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button size="sm" aria-label="upload">
        <UploadIcon />
      </Button>
      <Button size="md" aria-label="upload">
        <UploadIcon />
      </Button>
      <Button size="lg" aria-label="upload">
        <UploadIcon />
      </Button>
      <Button size="sm" aria-label="upload" className="rounded-full">
        <UploadIcon />
      </Button>
      <Button size="md" aria-label="upload" className="rounded-full">
        <UploadIcon />
      </Button>
      <Button size="lg" aria-label="upload" className="rounded-full">
        <UploadIcon />
      </Button>
    </div>
  );
}
