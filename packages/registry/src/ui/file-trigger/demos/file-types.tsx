import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function Demo() {
	return (
		<FileTrigger acceptedFileTypes={["image/*"]}>
			<Button>
				<UploadIcon /> Upload image
			</Button>
		</FileTrigger>
	);
}
