import { UploadIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";

export default function Demo() {
	return (
		<div className="flex items-center justify-center gap-4">
			<Button size="sm" isIconOnly aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="md" isIconOnly aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="lg" isIconOnly aria-label="upload">
				<UploadIcon />
			</Button>
			<Button size="sm" isIconOnly aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
			<Button size="md" isIconOnly aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
			<Button size="lg" isIconOnly aria-label="upload" className="rounded-full">
				<UploadIcon />
			</Button>
		</div>
	);
}
