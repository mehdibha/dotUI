import { UploadIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { FileTrigger } from "@/registry/ui/file-trigger";

export default function Demo() {
	return (
		<FileTrigger acceptedFileTypes={["image/*"]}>
			<Button>
				<UploadIcon /> Upload image
			</Button>
		</FileTrigger>
	);
}
