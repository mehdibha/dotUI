import { BRAND_VALUES } from "./assets"
import { options } from "./core/meta"

export const BRAND_OPTIONS = options(BRAND_VALUES, {
  none: { label: "None", description: "A placeholder mark on primary" },
  airbnb: { label: "Airbnb" },
  claude: { label: "Claude" },
  duolingo: { label: "Duolingo" },
  github: { label: "GitHub" },
  ibm: { label: "IBM" },
  linear: { label: "Linear" },
  material: { label: "Material Design" },
  notion: { label: "Notion" },
  radix: { label: "Radix" },
  shopify: { label: "Shopify" },
  spotify: { label: "Spotify" },
  stripe: { label: "Stripe" },
  supabase: { label: "Supabase" },
  vercel: { label: "Vercel" },
})

export const OPTIONS = {
  brandAssets: BRAND_OPTIONS,
}
