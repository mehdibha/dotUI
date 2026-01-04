import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
	return (
		<div className="flex items-center gap-2">
			<Button>
				<UploadIcon /> Upload
			</Button>
			<Button>
				Upload <UploadIcon />
			</Button>
		</div>
	);
}
