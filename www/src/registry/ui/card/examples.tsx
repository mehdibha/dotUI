import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import BasicDemo from "./demos/basic";
import DefaultDemo from "./demos/default";
import FooterBorderDemo from "./demos/footer-border";
import FooterBorderSmallDemo from "./demos/footer-border-small";
import HeaderBorderDemo from "./demos/header-border";
import HeaderBorderSmallDemo from "./demos/header-border-small";
import MeetingNotesDemo from "./demos/meeting-notes";
import SmallDemo from "./demos/small";
import WithImageDemo from "./demos/with-image";
import WithImageSmallDemo from "./demos/with-image-small";

export default function CardExamples() {
	return (
		<Examples className="**:data-example-preview:justify-center lg:grid-cols-2">
			<Example title="Default">
				<DefaultDemo />
			</Example>
			<Example title="Small">
				<SmallDemo />
			</Example>
			<Example title="Header with Border">
				<HeaderBorderDemo />
			</Example>
			<Example title="Footer with Border">
				<FooterBorderDemo />
			</Example>
			<Example title="Header with Border (Small)">
				<HeaderBorderSmallDemo />
			</Example>
			<Example title="Footer with Border (Small)">
				<FooterBorderSmallDemo />
			</Example>
			<Example title="With Image" className="**:data-card:pt-0!">
				<WithImageDemo />
			</Example>
			<Example title="With Image (Small)" className="**:data-card:pt-0!">
				<WithImageSmallDemo />
			</Example>
			<Example title="Login">
				<BasicDemo />
			</Example>
			<Example title="Meeting Notes">
				<MeetingNotesDemo />
			</Example>
		</Examples>
	);
}
