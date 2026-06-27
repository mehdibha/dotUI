import { Disclosure, DisclosurePanel, DisclosureTrigger } from 'www'

const wrap: React.CSSProperties = { width: 420 }

export const Expanded = () => (
  <div style={wrap}>
    <Disclosure defaultExpanded>
      <DisclosureTrigger>System requirements</DisclosureTrigger>
      <DisclosurePanel>
        Details about system requirements go here. Describes the minimum and
        recommended hardware and software needed.
      </DisclosurePanel>
    </Disclosure>
  </div>
)

export const Collapsed = () => (
  <div style={wrap}>
    <Disclosure>
      <DisclosureTrigger>Billing &amp; invoices</DisclosureTrigger>
      <DisclosurePanel>
        Manage your payment methods, download past invoices, and update your
        billing address.
      </DisclosurePanel>
    </Disclosure>
  </div>
)

export const Group = () => (
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 420 }}
  >
    <Disclosure defaultExpanded>
      <DisclosureTrigger>What is your refund policy?</DisclosureTrigger>
      <DisclosurePanel>
        We offer a full refund within 30 days of purchase, no questions asked.
      </DisclosurePanel>
    </Disclosure>
    <Disclosure>
      <DisclosureTrigger>Can I change my plan later?</DisclosureTrigger>
      <DisclosurePanel>
        Yes, you can upgrade or downgrade your plan at any time from settings.
      </DisclosurePanel>
    </Disclosure>
    <Disclosure>
      <DisclosureTrigger>Do you offer team accounts?</DisclosureTrigger>
      <DisclosurePanel>
        Team accounts are available on the Pro and Enterprise tiers.
      </DisclosurePanel>
    </Disclosure>
  </div>
)
