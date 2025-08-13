interface ShadowsRegistryItem {
  name: string;
  slug: string;
  properties: {
    color: string;
    opacity: number;
    blurRadius: number;
    offsetX: number;
    offsetY: number;
    spread: number;
  };
}

export const registryShadows: ShadowsRegistryItem[] = [
  {
    name: "Brutalist",
    slug: "brutalist",
    properties: {
      color: "#000",
      opacity: 0.5,
      blurRadius: 10,
      offsetX: 0,
      offsetY: 0,
      spread: 0,
    },
  },
];
