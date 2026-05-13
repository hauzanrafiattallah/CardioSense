"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Does CardioSense replace a doctor?",
    answer:
      "No. CardioSense is designed for early screening and education only. It does not replace professional diagnosis, treatment, or medical consultation.",
  },
  {
    question: "What data is used for screening?",
    answer:
      "The screening preview is based on common health indicators such as age, blood pressure, cholesterol, smoking status, physical activity, and family history.",
  },
  {
    question: "Are the results always accurate?",
    answer:
      "No screening result is perfect. The result should be interpreted as an early risk indicator, not as a confirmed medical condition.",
  },
  {
    question: "Who can use CardioSense?",
    answer:
      "CardioSense is intended for general users who want to better understand cardiovascular risk and learn preventive habits.",
  },
  {
    question: "What should I do after getting a high-risk result?",
    answer:
      "You should consult a qualified healthcare professional and consider checking relevant health markers such as blood pressure, cholesterol, blood sugar, and lifestyle risk factors.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-[#FFF8F9] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading title="Frequently Asked Questions" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="grid gap-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
