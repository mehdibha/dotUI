export interface Plan {
  name: string;
  description: string;
  features: string[];
  featured: boolean;
  price: {
    monthly: string;
    yearly: string;
  };
  cta: {
    label: string;
    href: string;
  };
}
