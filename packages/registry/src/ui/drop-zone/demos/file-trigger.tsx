import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { DropZone, DropZoneLabel } from "@dotui/registry/ui/drop-zone";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function Demo() {
  return (
    <DropZone className="space-y-1">
      <UploadIcon className="size-5 text-fg-muted" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      <FileTrigger>
        <Button>Select files</Button>
      </FileTrigger>
    </DropZone>
  );
}
