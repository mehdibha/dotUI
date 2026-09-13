import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"

const categories = [
  {
    name: "Collaboration",
    features: [
      "Real-time multiplayer editing",
      "Inline comments and mentions",
      "Shared workspaces with roles",
    ],
  },
  {
    name: "Automation",
    features: [
      "Custom workflow triggers",
      "Scheduled tasks and reminders",
      "Webhooks for any event",
    ],
  },
  {
    name: "Security",
    features: [
      "SSO and SCIM provisioning",
      "Granular access controls",
      "Audit logs and data export",
    ],
  },
]

export default function Demo() {
  return (
    <Accordion
      className="w-full max-w-xs"
      defaultExpandedKeys={["Collaboration"]}
    >
      {categories.map((category) => (
        <AccordionItem key={category.name} id={category.name}>
          <AccordionTrigger>{category.name}</AccordionTrigger>
          <AccordionPanel>
            <ul className="list-disc space-y-1 pl-4 text-sm text-fg-muted">
              {category.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
