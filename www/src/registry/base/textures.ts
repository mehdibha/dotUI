interface TextureRegistryItem {
	name: string;
	slug: string;
	description: string;
	css: Record<string, Record<string, string>>;
}

export const registryTextures = [
	{
		name: "Earthen haze",
		slug: "earthen-haze",
		description: "A subtle, organic overlay adding gentle nautral tones and warmth.",
		css: {
			".texture": {
				"background-image": "url(https://matsu-theme.vercel.app/texture.jpg)",
				"background-size": "100% 100%",
				"background-repeat": "repeat",
				opacity: "0.12",
				"mix-blend-mode": "multiply",
				"z-index": "100",
				isolation: "isolate",
				position: "fixed",
				inset: "0",
				width: "100vw",
				height: "100dvh",
				"pointer-events": "none",
			},
		},
	},
	{
		name: "Fractal noise",
		slug: "fractal-noise",
		description: "A dynamic fractal noise pattern with soft light blending.",
		css: {
			".texture": {
				"background-image":
					"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'%3E%3C/rect%3E%3C/svg%3E\")",
				"background-size": "100% 100%",
				"background-repeat": "no-repeat",
				opacity: "0.70",
				"mix-blend-mode": "soft-light",
				"z-index": "50",
				isolation: "isolate",
				position: "fixed",
				inset: "0",
				width: "100vw",
				height: "100dvh",
				"pointer-events": "none",
			},
		},
	},
	{
		name: "Tiled pattern",
		slug: "tiled-pattern",
		description: "A subtle repeating pattern with very low opacity overlay.",
		css: {
			".texture": {
				"background-image":
					"url('https://web.archive.org/web/20250107133042im_/https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
				"background-size": "109px",
				"background-repeat": "repeat",
				opacity: "0.06",
				"border-radius": "0",
				"z-index": "100",
				isolation: "isolate",
				position: "fixed",
				inset: "0",
				width: "100vw",
				height: "100dvh",
				"pointer-events": "none",
			},
		},
	},
] as const satisfies TextureRegistryItem[];
