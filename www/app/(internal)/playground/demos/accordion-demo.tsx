"use client";

import {
  Accordion,
  AccordionHeading,
  AccordionItem,
  AccordionPanel,
} from "@dotui/registry/ui/accordion";

export function AccordionDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <Accordion>
          <AccordionItem>
            <AccordionHeading>Is it accessible?</AccordionHeading>
            <AccordionPanel>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeading>Is it styled?</AccordionHeading>
            <AccordionPanel>
              Yes. It comes with default styles that matches the other
              components.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeading>Is it animated?</AccordionHeading>
            <AccordionPanel>
              Yes. It's animated by default, but you can disable it if you want.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion>
          <AccordionItem>
            <AccordionHeading>
              What are the key considerations when implementing a comprehensive
              enterprise-level authentication system?
            </AccordionHeading>
            <AccordionPanel>
              Implementing a robust enterprise authentication system requires
              careful consideration of multiple factors. This includes secure
              password hashing and storage, multi-factor authentication (MFA)
              implementation, session management, OAuth2 and SSO integration,
              regular security audits, rate limiting to prevent brute force
              attacks, and maintaining detailed audit logs. Additionally, you'll
              need to consider scalability, performance impact, and compliance
              with relevant data protection regulations such as GDPR or HIPAA.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeading>
              How does modern distributed system architecture handle eventual
              consistency and data synchronization across multiple regions?
            </AccordionHeading>
            <AccordionPanel>
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-4">
        <AccordionItem>
          <AccordionHeading>Accordion Heading 3</AccordionHeading>
          <AccordionPanel>Accordion Panel 3</AccordionPanel>
        </AccordionItem>
      </div>
    </div>
  );
}
