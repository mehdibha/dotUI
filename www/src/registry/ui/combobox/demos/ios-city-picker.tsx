"use client";

import * as React from "react";
import { ChevronDownIcon, MicIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { DialogContent, DialogTitle } from "@/registry/ui/dialog";
import { Drawer } from "@/registry/ui/drawer";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";

const cities = [
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
	"Algiers, Algeria",
	"Alexandria, Egypt",
	"Amsterdam, Netherlands",
	"Anchorage, U.S.A.",
	"Ankara, Turkey",
	"Athens, Greece",
	"Auckland, New Zealand",
	"Baghdad, Iraq",
	"Bangkok, Thailand",
	"Barcelona, Spain",
	"Beijing, China",
	"Beirut, Lebanon",
	"Belgrade, Serbia",
	"Berlin, Germany",
	"Bogotá, Colombia",
	"Boston, U.S.A.",
	"Brasília, Brazil",
	"Brussels, Belgium",
	"Buenos Aires, Argentina",
	"Cairo, Egypt",
	"Calgary, Canada",
	"Cape Town, South Africa",
	"Caracas, Venezuela",
	"Casablanca, Morocco",
	"Chicago, U.S.A.",
	"Copenhagen, Denmark",
	"Dakar, Senegal",
	"Dallas, U.S.A.",
	"Damascus, Syria",
	"Delhi, India",
	"Denver, U.S.A.",
	"Detroit, U.S.A.",
	"Doha, Qatar",
	"Dubai, U.A.E.",
	"Dublin, Ireland",
	"Edinburgh, United Kingdom",
	"Edmonton, Canada",
	"Entebbe, Uganda",
	"Florence, Italy",
	"Frankfurt, Germany",
	"Freetown, Sierra Leone",
	"Geneva, Switzerland",
	"Georgetown, Guyana",
	"Guadalajara, Mexico",
	"Guangzhou, China",
	"Guatemala City, Guatemala",
	"Hamburg, Germany",
	"Hanoi, Vietnam",
	"Havana, Cuba",
	"Helsinki, Finland",
	"Hong Kong, China",
	"Honolulu, U.S.A.",
	"Houston, U.S.A.",
	"Ibadan, Nigeria",
	"Incheon, South Korea",
	"Indianapolis, U.S.A.",
	"Istanbul, Turkey",
	"Jakarta, Indonesia",
	"Jerusalem, Israel",
	"Johannesburg, South Africa",
	"Kabul, Afghanistan",
	"Kampala, Uganda",
	"Karachi, Pakistan",
	"Kathmandu, Nepal",
	"Khartoum, Sudan",
	"Kigali, Rwanda",
	"Kingston, Jamaica",
	"Kuala Lumpur, Malaysia",
	"Kuwait City, Kuwait",
	"La Paz, Bolivia",
	"Lagos, Nigeria",
	"Lahore, Pakistan",
	"Las Vegas, U.S.A.",
	"Lima, Peru",
	"Lisbon, Portugal",
	"London, United Kingdom",
	"Los Angeles, U.S.A.",
	"Madrid, Spain",
	"Manila, Philippines",
	"Melbourne, Australia",
	"Mexico City, Mexico",
	"Miami, U.S.A.",
	"Milan, Italy",
	"Montreal, Canada",
	"Moscow, Russia",
	"Mumbai, India",
	"Nairobi, Kenya",
	"Naples, Italy",
	"Nassau, Bahamas",
	"New Delhi, India",
	"New Orleans, U.S.A.",
	"New York, U.S.A.",
	"Nice, France",
	"Nouméa, New Caledonia",
	"Osaka, Japan",
	"Oslo, Norway",
	"Ottawa, Canada",
	"Ouagadougou, Burkina Faso",
	"Panama City, Panama",
	"Paris, France",
	"Perth, Australia",
	"Philadelphia, U.S.A.",
	"Phoenix, U.S.A.",
	"Prague, Czech Republic",
	"Quito, Ecuador",
	"Rabat, Morocco",
	"Reykjavík, Iceland",
	"Riga, Latvia",
	"Rio de Janeiro, Brazil",
	"Rome, Italy",
	"San Diego, U.S.A.",
	"San Francisco, U.S.A.",
	"San Juan, Puerto Rico",
	"San Salvador, El Salvador",
	"Santiago, Chile",
	"São Paulo, Brazil",
	"Seattle, U.S.A.",
	"Seoul, South Korea",
	"Shanghai, China",
	"Singapore, Singapore",
	"Stockholm, Sweden",
	"Sydney, Australia",
	"Taipei, Taiwan",
	"Tallinn, Estonia",
	"Tashkent, Uzbekistan",
	"Tbilisi, Georgia",
	"Tehran, Iran",
	"Tokyo, Japan",
	"Toronto, Canada",
	"Tunis, Tunisia",
	"Ulaanbaatar, Mongolia",
	"Utrecht, Netherlands",
	"Valencia, Spain",
	"Vancouver, Canada",
	"Venice, Italy",
	"Vienna, Austria",
	"Vilnius, Lithuania",
	"Warsaw, Poland",
	"Washington, D.C., U.S.A.",
	"Wellington, New Zealand",
	"Winnipeg, Canada",
	"Xi'an, China",
	"Yamoussoukro, Côte d'Ivoire",
	"Yaoundé, Cameroon",
	"Yerevan, Armenia",
	"Zagreb, Croatia",
	"Zanzibar, Tanzania",
	"Zürich, Switzerland",
].map((name) => ({
	id: name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, ""),
	name,
}));

const indexLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

function groupCities(items: typeof cities) {
	return indexLetters
		.map((letter) => ({
			letter,
			cities: items.filter((city) => {
				const first = city.name.charAt(0).toUpperCase();
				return letter === "#" ? !/[A-Z]/.test(first) : first === letter;
			}),
		}))
		.filter((group) => group.cities.length > 0);
}

const cityGroups = groupCities(cities);

function getScrollTargetLetter(letter: string, groups = cityGroups) {
	if (letter === "#") {
		return groups.at(-1)?.letter;
	}

	return groups.find((group) => group.letter >= letter)?.letter ?? groups.at(-1)?.letter;
}

export default function Demo() {
	const [isOpen, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
	const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
	const filteredCityGroups = React.useMemo(() => {
		const query = normalize(inputValue.trim());
		const filteredCities = query ? cities.filter((city) => normalize(city.name).includes(query)) : cities;

		return groupCities(filteredCities);
	}, [inputValue]);

	const scrollToLetter = (letter: string) => {
		const targetLetter = getScrollTargetLetter(letter, filteredCityGroups);
		if (!targetLetter) return;

		sectionRefs.current[targetLetter]?.scrollIntoView({
			block: "start",
			behavior: "smooth",
		});
	};

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		if (open) {
			setInputValue("");
		}
	};

	const selectCity = (city: string) => {
		setSelectedCity(city);
		setInputValue("");
		setOpen(false);
	};

	return (
		<Combobox
			aria-label="City"
			inputValue={inputValue}
			isOpen={isOpen}
			menuTrigger="manual"
			onInputChange={setInputValue}
			onOpenChange={handleOpenChange}
			className="w-full max-w-72"
		>
			<Button variant="default" className="w-full justify-between" onPress={() => handleOpenChange(true)}>
				<span className={selectedCity ? "truncate" : "truncate text-fg-muted"}>{selectedCity ?? "Choose a city"}</span>
				<ChevronDownIcon aria-hidden="true" />
			</Button>
			<Drawer
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				placement="bottom"
				className="h-[calc(var(--visual-viewport-height)-1rem)] max-h-[calc(var(--visual-viewport-height)-1rem)] rounded-t-[2.25rem]! border-0! bg-[#1c1c1e]! text-white! shadow-none!"
			>
				<DialogContent
					aria-label="Choose a City"
					className="h-full gap-0 overflow-hidden p-0! text-white [font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text',system-ui,sans-serif]"
				>
					{() => (
						<>
							<div className="relative z-2 h-24 shrink-0">
								<Button
									slot="close"
									variant="quiet"
									isIconOnly
									aria-label="Close"
									className="absolute top-5 left-5 size-14 rounded-full! border border-white/10 bg-[#2c2c2e]! text-white/90 hover:bg-[#3a3a3c]!"
								>
									<XIcon aria-hidden="true" className="size-10 stroke-[1.7]" />
								</Button>
								<DialogTitle className="absolute inset-x-20 top-9 truncate text-center font-bold text-[1.7rem] text-white leading-none">
									Choose a City
								</DialogTitle>
							</div>
							<div className="relative min-h-0 flex-1">
								<div
									role="listbox"
									aria-label="Cities"
									className="h-full scroll-py-4 overflow-y-auto px-5 pt-2 pr-11 pb-28 text-white outline-none"
								>
									{filteredCityGroups.length > 0 ? (
										filteredCityGroups.map((group) => (
											<div key={group.letter}>
												<div
													ref={(element) => {
														sectionRefs.current[group.letter] = element;
													}}
													className="px-0 pt-7 pb-3 font-bold text-[#8e8e93] text-[1.4rem] leading-none"
												>
													{group.letter}
												</div>
												{group.cities.map((city) => (
													<button
														key={city.id}
														type="button"
														role="option"
														aria-selected={selectedCity === city.name}
														className="flex min-h-16 w-full items-center border-[#3a3a3c] border-b bg-transparent px-0 py-0 text-left font-normal text-[1.55rem] text-white leading-tight outline-none hover:bg-transparent focus-visible:bg-[#2c2c2e]"
														onClick={() => selectCity(city.name)}
													>
														{city.name}
													</button>
												))}
											</div>
										))
									) : (
										<div className="pt-24 text-center font-medium text-[#8e8e93] text-[1.25rem]">No cities found</div>
									)}
								</div>
								<div className="pointer-events-none absolute inset-y-6 right-1 z-3 flex w-8 items-center justify-center">
									<div className="pointer-events-auto flex flex-col items-center">
										{indexLetters.map((letter) => (
											<button
												key={letter}
												type="button"
												aria-label={`Jump to ${letter}`}
												className="flex h-[0.92rem] w-7 items-center justify-center rounded-sm font-semibold text-[#ff9f0a] text-[0.72rem] leading-none outline-none focus-visible:ring-2 focus-visible:ring-[#ff9f0a]/50"
												onClick={() => scrollToLetter(letter)}
											>
												{letter}
											</button>
										))}
									</div>
								</div>
								<div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/95 to-transparent px-5 pt-10 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
									<InputGroup className="pointer-events-auto h-14! rounded-full! border-[#3a3a3c]! bg-[#2c2c2e]/95! shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
										<InputGroupAddon className="pl-4! text-[#aeaeb2]! *:[svg]:size-7!">
											<SearchIcon aria-hidden="true" />
										</InputGroupAddon>
										<Input
											autoFocus
											placeholder="Search"
											className="font-semibold text-[1.55rem]! text-white! placeholder:text-[#aeaeb2]!"
										/>
										<InputGroupAddon className="pr-4! text-[#aeaeb2]! *:[svg]:size-7!">
											<MicIcon aria-hidden="true" />
										</InputGroupAddon>
									</InputGroup>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Drawer>
		</Combobox>
	);
}
