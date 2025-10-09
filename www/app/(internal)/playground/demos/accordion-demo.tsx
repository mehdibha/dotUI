"use client";

import { Accordion } from "@dotui/registry-v2/ui/accordion";

export function AccordionDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Heading>Is it accessible?</Accordion.Heading>
            <Accordion.Panel>
              Yes. It adheres to the WAI-ARIA design pattern.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>Is it styled?</Accordion.Heading>
            <Accordion.Panel>
              Yes. It comes with default styles that matches the other
              components.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>Is it animated?</Accordion.Heading>
            <Accordion.Panel>
              Yes. It's animated by default, but you can disable it if you want.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Heading>
              What are the key considerations when implementing a comprehensive
              enterprise-level authentication system?
            </Accordion.Heading>
            <Accordion.Panel>
              Implementing a robust enterprise authentication system requires
              careful consideration of multiple factors. This includes secure
              password hashing and storage, multi-factor authentication (MFA)
              implementation, session management, OAuth2 and SSO integration,
              regular security audits, rate limiting to prevent brute force
              attacks, and maintaining detailed audit logs. Additionally, you'll
              need to consider scalability, performance impact, and compliance
              with relevant data protection regulations such as GDPR or HIPAA.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              How does modern distributed system architecture handle eventual
              consistency and data synchronization across multiple regions?
            </Accordion.Heading>
            <Accordion.Panel>
              Modern distributed systems employ various strategies to maintain
              data consistency across regions. This often involves using
              techniques like CRDT (Conflict-Free Replicated Data Types), vector
              clocks, and gossip protocols. Systems might implement event
              sourcing patterns, utilize message queues for asynchronous
              updates, and employ sophisticated conflict resolution strategies.
              Popular solutions like Amazon's DynamoDB and Google's Spanner
              demonstrate different approaches to solving these challenges,
              balancing between consistency, availability, and partition
              tolerance as described in the CAP theorem.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <div className="space-y-4">
        <Accordion.Item>
          <Accordion.Heading>Accordion Heading 3</Accordion.Heading>
          <Accordion.Panel>Accordion Panel 3</Accordion.Panel>
        </Accordion.Item>
      </div>
    </div>
  );
}
