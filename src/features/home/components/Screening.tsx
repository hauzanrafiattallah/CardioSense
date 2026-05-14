"use client";

import { motion } from "framer-motion";

import { Disclaimer } from "@/components/shared/Disclaimer";
import { SectionTitle } from "@/components/shared/SectionTitle";
import {
  screeningContent,
  screeningFields,
} from "@/features/home/data/HomeData";
import { Form } from "@/features/screening/components/Form";
import { Result } from "@/features/screening/components/Result";
import { useScreening } from "@/features/screening/hooks/UseScreening";

export function Screening() {
  const {
    values,
    errors,
    result,
    hasSubmitted,
    updateValue,
    submitScreening,
    resetScreening,
  } = useScreening();

  return (
    <section id="screening" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTitle
            eyebrow={screeningContent.eyebrow}
            title={screeningContent.title}
            subtitle={screeningContent.subtitle}
          />
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Form
            eyebrow={screeningContent.formEyebrow}
            title={screeningContent.formTitle}
            description={screeningContent.formDescription}
            submitLabel={screeningContent.submitLabel}
            resetLabel={screeningContent.resetLabel}
            fields={screeningFields}
            values={values}
            errors={errors}
            onChange={updateValue}
            onSubmit={submitScreening}
            onReset={resetScreening}
          />
          <Result result={result} hasSubmitted={hasSubmitted} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="mt-7"
        >
          <Disclaimer>{screeningContent.disclaimer}</Disclaimer>
        </motion.div>
      </div>
    </section>
  );
}
