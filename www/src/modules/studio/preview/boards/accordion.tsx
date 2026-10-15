"use client"

import { useEffect, useState } from "react"
import type { Key } from "react-aria-components"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"

import { Board, BoardSection, useReplay, useSteps } from "./board"

const FAQ = [
  {
    id: "plan",
    question: "What's in Pro?",
    answer: "Unlimited projects and priority support.",
  },
  {
    id: "change",
    question: "Can I switch plans?",
    answer: "Upgrades apply at once, downgrades at renewal.",
  },
  {
    id: "refund",
    question: "Do you offer refunds?",
    answer: "Within 14 days, no questions asked.",
  },
]

const REST = "plan"

export default function AccordionBoard() {
  const motion = useReplay("accordionMotion")
  const replaying = motion.running
  const step = useSteps(motion, 1400)
  const [expanded, setExpanded] = useState<Iterable<Key>>([REST])

  useEffect(() => {
    const item = replaying ? FAQ[step % FAQ.length]?.id : REST
    setExpanded([item ?? REST])
  }, [replaying, step])

  return (
    <Board id="accordion">
      <BoardSection title="In context">
        <Accordion
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
          className="w-full max-w-2xl"
        >
          {FAQ.map((item) => (
            <AccordionItem key={item.id} id={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionPanel>{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </BoardSection>
    </Board>
  )
}
