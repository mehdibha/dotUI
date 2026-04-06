import { Example } from "@/modules/create/preview/example";

import Default from "./demos/default";
import DirectorySelection from "./demos/directory-selection";
import FileTypes from "./demos/file-types";
import MediaCapture from "./demos/media-capture";
import MultipleFiles from "./demos/multiple-files";

export default function Examples() {
	return (
		<>
			<Example title="default">
				<Default />
			</Example>
			<Example title="directory selection">
				<DirectorySelection />
			</Example>
			<Example title="file types">
				<FileTypes />
			</Example>
			<Example title="media capture">
				<MediaCapture />
			</Example>
			<Example title="multiple files">
				<MultipleFiles />
			</Example>
		</>
	);
}
