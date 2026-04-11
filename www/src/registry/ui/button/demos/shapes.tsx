import { UploadIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";

export default function Demo() {
	return (
		<div className="flex items-center justify-center gap-4">
			<Button size="icon-sm" aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="icon" aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="icon-lg" aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="icon-sm" aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
			<Button size="icon" aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
			<Button size="icon-lg" aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
		</div>
	);
}
