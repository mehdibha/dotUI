import { CameraIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function Demo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button>
        <CameraIcon /> Take a picture
      </Button>
    </FileTrigger>
  );
}
