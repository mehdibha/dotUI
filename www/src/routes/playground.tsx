"use client";

import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MicIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";

export const Route = createFileRoute("/playground")({
	component: PlaygroundPage,
});

const CITIES = [
	"Abidjan, Côte d'Ivoire",
	"Abu Dhabi, U.A.E.",
	"Acapulco, Mexico",
	"Accra, Ghana",
	"Adak, U.S.A.",
	"Adamstown, Pitcairn Islands",
	"Addis Ababa, Ethiopia",
	"Adelaide, Australia",
	"Aden, Yemen",
	"Aktau, Kazakhstan",
	"Albuquerque, U.S.A.",
	"Alexandria, Egypt",
	"Algiers, Algeria",
	"Almaty, Kazakhstan",
	"Amman, Jordan",
	"Amsterdam, Netherlands",
	"Anchorage, U.S.A.",
	"Andorra la Vella, Andorra",
	"Ankara, Turkey",
	"Apia, Samoa",
	"Asmara, Eritrea",
	"Astana, Kazakhstan",
	"Asunción, Paraguay",
	"Athens, Greece",
	"Atlanta, U.S.A.",
	"Auckland, New Zealand",
	"Austin, U.S.A.",
	"Baghdad, Iraq",
	"Baku, Azerbaijan",
	"Bamako, Mali",
	"Bangkok, Thailand",
	"Bangui, Central African Republic",
	"Banjul, Gambia",
	"Barcelona, Spain",
	"Beijing, China",
	"Beirut, Lebanon",
	"Belgrade, Serbia",
	"Belmopan, Belize",
	"Berlin, Germany",
	"Bern, Switzerland",
	"Bishkek, Kyrgyzstan",
	"Bissau, Guinea-Bissau",
	"Bogotá, Colombia",
	"Boston, U.S.A.",
	"Brasília, Brazil",
	"Bratislava, Slovakia",
	"Brussels, Belgium",
	"Bucharest, Romania",
	"Budapest, Hungary",
	"Buenos Aires, Argentina",
	"Cairo, Egypt",
	"Canberra, Australia",
	"Cape Town, South Africa",
	"Caracas, Venezuela",
	"Casablanca, Morocco",
	"Chicago, U.S.A.",
	"Chișinău, Moldova",
	"Colombo, Sri Lanka",
	"Conakry, Guinea",
	"Copenhagen, Denmark",
	"Dakar, Senegal",
	"Dallas, U.S.A.",
	"Damascus, Syria",
	"Denver, U.S.A.",
	"Dhaka, Bangladesh",
	"Dili, East Timor",
	"Djibouti, Djibouti",
	"Dodoma, Tanzania",
	"Doha, Qatar",
	"Dubai, U.A.E.",
	"Dublin, Ireland",
	"Dushanbe, Tajikistan",
	"Edinburgh, U.K.",
	"Frankfurt, Germany",
	"Freetown, Sierra Leone",
	"Gaborone, Botswana",
	"Geneva, Switzerland",
	"Georgetown, Guyana",
	"Guatemala City, Guatemala",
	"Hanoi, Vietnam",
	"Harare, Zimbabwe",
	"Havana, Cuba",
	"Helsinki, Finland",
	"Honiara, Solomon Islands",
	"Hong Kong, China",
	"Honolulu, U.S.A.",
	"Houston, U.S.A.",
	"Islamabad, Pakistan",
	"Istanbul, Turkey",
	"Jakarta, Indonesia",
	"Jerusalem, Israel",
	"Johannesburg, South Africa",
	"Juba, South Sudan",
	"Kabul, Afghanistan",
	"Kampala, Uganda",
	"Karachi, Pakistan",
	"Kathmandu, Nepal",
	"Khartoum, Sudan",
	"Kiev, Ukraine",
	"Kigali, Rwanda",
	"Kingston, Jamaica",
	"Kingstown, Saint Vincent and the Grenadines",
	"Kinshasa, D.R. Congo",
	"Kuala Lumpur, Malaysia",
	"Kuwait City, Kuwait",
	"La Paz, Bolivia",
	"Lagos, Nigeria",
	"Las Vegas, U.S.A.",
	"Libreville, Gabon",
	"Lilongwe, Malawi",
	"Lima, Peru",
	"Lisbon, Portugal",
	"Ljubljana, Slovenia",
	"Lomé, Togo",
	"London, U.K.",
	"Los Angeles, U.S.A.",
	"Luanda, Angola",
	"Lusaka, Zambia",
	"Luxembourg, Luxembourg",
	"Madrid, Spain",
	"Majuro, Marshall Islands",
	"Malabo, Equatorial Guinea",
	"Malé, Maldives",
	"Managua, Nicaragua",
	"Manama, Bahrain",
	"Manila, Philippines",
	"Maputo, Mozambique",
	"Maseru, Lesotho",
	"Mbabane, Eswatini",
	"Melbourne, Australia",
	"Mexico City, Mexico",
	"Miami, U.S.A.",
	"Milan, Italy",
	"Minsk, Belarus",
	"Mogadishu, Somalia",
	"Monaco, Monaco",
	"Monrovia, Liberia",
	"Montevideo, Uruguay",
	"Montreal, Canada",
	"Moroni, Comoros",
	"Moscow, Russia",
	"Mumbai, India",
	"Muscat, Oman",
	"Nairobi, Kenya",
	"Nassau, Bahamas",
	"Naypyidaw, Myanmar",
	"New Delhi, India",
	"New York, U.S.A.",
	"Niamey, Niger",
	"Nicosia, Cyprus",
	"Nouakchott, Mauritania",
	"Nuku'alofa, Tonga",
	"Oslo, Norway",
	"Ottawa, Canada",
	"Ouagadougou, Burkina Faso",
	"Palikir, Micronesia",
	"Panama City, Panama",
	"Paramaribo, Suriname",
	"Paris, France",
	"Perth, Australia",
	"Philadelphia, U.S.A.",
	"Phnom Penh, Cambodia",
	"Phoenix, U.S.A.",
	"Podgorica, Montenegro",
	"Port Louis, Mauritius",
	"Port Moresby, Papua New Guinea",
	"Port-au-Prince, Haiti",
	"Port-of-Spain, Trinidad and Tobago",
	"Porto-Novo, Benin",
	"Prague, Czech Republic",
	"Pretoria, South Africa",
	"Pristina, Kosovo",
	"Pyongyang, North Korea",
	"Quito, Ecuador",
	"Rabat, Morocco",
	"Reykjavik, Iceland",
	"Riga, Latvia",
	"Riyadh, Saudi Arabia",
	"Rome, Italy",
	"Roseau, Dominica",
	"San Diego, U.S.A.",
	"San Francisco, U.S.A.",
	"San José, Costa Rica",
	"San Juan, Puerto Rico",
	"San Marino, San Marino",
	"San Salvador, El Salvador",
	"Sanaa, Yemen",
	"Santiago, Chile",
	"Santo Domingo, Dominican Republic",
	"São Paulo, Brazil",
	"São Tomé, São Tomé and Príncipe",
	"Sarajevo, Bosnia and Herzegovina",
	"Seattle, U.S.A.",
	"Seoul, South Korea",
	"Shanghai, China",
	"Singapore, Singapore",
	"Skopje, North Macedonia",
	"Sofia, Bulgaria",
	"Stockholm, Sweden",
	"Sucre, Bolivia",
	"Suva, Fiji",
	"Sydney, Australia",
	"Taipei, Taiwan",
	"Tallinn, Estonia",
	"Tarawa, Kiribati",
	"Tashkent, Uzbekistan",
	"Tbilisi, Georgia",
	"Tegucigalpa, Honduras",
	"Tehran, Iran",
	"Thimphu, Bhutan",
	"Tirana, Albania",
	"Tokyo, Japan",
	"Toronto, Canada",
	"Tripoli, Libya",
	"Tunis, Tunisia",
	"Ulaanbaatar, Mongolia",
	"Vaduz, Liechtenstein",
	"Valletta, Malta",
	"Vancouver, Canada",
	"Vatican City, Vatican",
	"Victoria, Seychelles",
	"Vienna, Austria",
	"Vientiane, Laos",
	"Vilnius, Lithuania",
	"Warsaw, Poland",
	"Washington, U.S.A.",
	"Wellington, New Zealand",
	"Windhoek, Namibia",
	"Yamoussoukro, Côte d'Ivoire",
	"Yaoundé, Cameroon",
	"Yerevan, Armenia",
	"Zagreb, Croatia",
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const stripDiacritics = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

const getInitial = (name: string) => {
	const ch = stripDiacritics(name)[0]?.toUpperCase() ?? "#";
	return /[A-Z]/.test(ch) ? ch : "#";
};

interface CitySection {
	letter: string;
	items: string[];
}

const groupCities = (cities: string[]): CitySection[] => {
	const map = new Map<string, string[]>();
	for (const c of cities) {
		const k = getInitial(c);
		if (!map.has(k)) map.set(k, []);
		map.get(k)?.push(c);
	}
	return ALPHA.filter((l) => map.has(l)).map((letter) => ({
		letter,
		items: map.get(letter) ?? [],
	}));
};

function PlaygroundPage() {
	return (
		<div className="dark flex min-h-svh items-center justify-center bg-black p-6">
			<Dialog>
				<Button variant="primary">Choose a City</Button>
				<Drawer
					placement="bottom"
					className="!max-h-[92vh] !min-h-[92vh] overflow-hidden rounded-t-[14px] border-0 bg-[#1c1c1e]"
				>
					<DialogContent className="m-0 min-h-0 flex-1 gap-0 p-0 text-white outline-none">
						<CityPicker />
					</DialogContent>
				</Drawer>
			</Dialog>
		</div>
	);
}

function CityPicker() {
	const [search, setSearch] = React.useState("");
	const [selected, setSelected] = React.useState<string | null>(null);
	const listRef = React.useRef<HTMLDivElement>(null);

	const filteredSections = React.useMemo(() => {
		const q = stripDiacritics(search.trim().toLowerCase());
		if (!q) return groupCities(CITIES);
		return groupCities(CITIES.filter((c) => stripDiacritics(c.toLowerCase()).includes(q)));
	}, [search]);

	const presentLetters = React.useMemo(
		() => new Set(filteredSections.map((s) => s.letter)),
		[filteredSections],
	);

	const scrollToLetter = React.useCallback(
		(letter: string) => {
			if (!presentLetters.has(letter)) return;
			const el = listRef.current?.querySelector<HTMLElement>(`[data-section-letter="${letter}"]`);
			el?.scrollIntoView({ block: "start", behavior: "auto" });
		},
		[presentLetters],
	);

	return (
		<>
			<header className="relative flex h-14 shrink-0 items-center justify-center px-4">
				<Button
					slot="close"
					aria-label="Close"
					className="absolute left-3 size-8 rounded-full border-0 bg-white/10 p-0 text-white hover:bg-white/15"
				>
					<XIcon className="size-4" />
				</Button>
				<h2 className="font-semibold text-[17px] text-white">Choose a City</h2>
			</header>

			<div className="relative min-h-0 flex-1">
				<div ref={listRef} className="absolute inset-0 overflow-y-auto pr-3">
					{filteredSections.length === 0 ? (
						<p className="px-4 py-10 text-center text-sm text-white/50">No results</p>
					) : (
						filteredSections.map((section) => (
							<section key={section.letter} data-section-letter={section.letter}>
								<h3 className="px-4 pt-3 pb-0.5 font-normal text-[15px] text-white/40">
									{section.letter}
								</h3>
								<ul>
									{section.items.map((city, idx) => (
										<li key={city}>
											<button
												type="button"
												onClick={() => setSelected(city)}
												className="block w-full cursor-pointer px-4 py-3 text-left text-[17px] text-white active:bg-white/10"
											>
												{city}
											</button>
											{idx < section.items.length - 1 && (
												<div className="ml-4 h-px bg-white/[0.08]" />
											)}
										</li>
									))}
								</ul>
							</section>
						))
					)}
				</div>
				<AlphabetIndex activeLetters={presentLetters} onSelect={scrollToLetter} />
			</div>

			<div className="shrink-0 px-2.5 pt-2 pb-[max(env(safe-area-inset-bottom),0.625rem)]">
				<div className="flex h-9 items-center gap-2 rounded-[10px] bg-white/10 px-2.5">
					<SearchIcon className="size-4 text-white/60" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search"
						className="flex-1 bg-transparent text-[17px] text-white outline-none placeholder:text-white/60"
					/>
					<button type="button" className="text-white/60" aria-label="Voice search">
						<MicIcon className="size-4" />
					</button>
				</div>
				{selected && (
					<p className="pt-2 text-center text-[13px] text-white/50">
						Selected: <span className="text-white/80">{selected}</span>
					</p>
				)}
			</div>
		</>
	);
}

interface AlphabetIndexProps {
	activeLetters: Set<string>;
	onSelect: (letter: string) => void;
}

function AlphabetIndex({ activeLetters, onSelect }: AlphabetIndexProps) {
	const selectFromPoint = React.useCallback(
		(clientX: number, clientY: number) => {
			const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
			const letter = el?.dataset?.alpha;
			if (letter) onSelect(letter);
		},
		[onSelect],
	);

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
		selectFromPoint(e.clientX, e.clientY);
	};

	return (
		<div
			onPointerDown={(e) => {
				const target = e.target as HTMLElement;
				if (!target.dataset?.alpha) return;
				e.currentTarget.setPointerCapture?.(e.pointerId);
				selectFromPoint(e.clientX, e.clientY);
			}}
			onPointerMove={handlePointerMove}
			className="-translate-y-1/2 absolute top-1/2 right-0 flex touch-none select-none flex-col items-center pr-1.5"
		>
			{ALPHA.map((letter) => (
				<button
					key={letter}
					type="button"
					data-alpha={letter}
					tabIndex={-1}
					onClick={() => onSelect(letter)}
					className={`cursor-pointer px-1.5 py-px font-semibold text-[11px] leading-[1.05] ${
						activeLetters.has(letter) ? "text-[#ff9f0a]" : "text-white/30"
					}`}
				>
					{letter}
				</button>
			))}
		</div>
	);
}
