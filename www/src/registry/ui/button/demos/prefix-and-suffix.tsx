import { UploadIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";

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
