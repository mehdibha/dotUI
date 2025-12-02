import { Accordion } from "@dotui/registry/ui/accordion";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

const faq = [
  {
    question: "How do I get started with DotUI?",
    answer:
      "Getting started is simple! Install the package using your preferred package manager, then import the components you need. All components are built on React Aria Components and follow accessibility best practices out of the box.",
  },
  {
    question: "Is DotUI free to use?",
    answer:
      "Yes, DotUI is completely free and open source. You can use it in any project, whether personal or commercial, without any restrictions or licensing fees.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Absolutely! All components use Tailwind Variants for styling, making it easy to customize colors, sizes, and other visual properties. You can pass custom className props or extend the default variants to match your design system.",
  },
  {
    question: "Does DotUI support TypeScript?",
    answer:
      "Yes, DotUI is built with TypeScript and provides full type definitions for all components. This ensures type safety and excellent developer experience with autocomplete and IntelliSense support in your IDE.",
  },
];

export default function Demo() {
  return (
    <Accordion className="w-full max-w-2xl">
      {faq.map((item) => (
        <Disclosure key={item.question}>
          <DisclosureTrigger>{item.question}</DisclosureTrigger>
          <DisclosurePanel>{item.answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  );
}
