"use client";

import type { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  ScreeningErrors,
  ScreeningField,
  ScreeningFieldName,
  ScreeningFormValues,
} from "@/features/screening/types/Screening";
import { cn } from "@/lib/Utils";

type FormProps = {
  eyebrow: string;
  title: string;
  fields: ScreeningField[];
  description: string;
  submitLabel: string;
  resetLabel: string;
  values: ScreeningFormValues;
  errors: ScreeningErrors;
  onChange: (name: ScreeningFieldName, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export function Form({
  eyebrow,
  title,
  fields,
  description,
  submitLabel,
  resetLabel,
  values,
  errors,
  onChange,
  onSubmit,
  onReset,
}: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onChange(event.target.name as ScreeningFieldName, event.target.value);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C51624]">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-[#111418]">
            {title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B7280]">
            {description}
          </p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF1F3] text-[#C51624]">
          <HeartPulse className="size-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {fields.map((field) => {
            const fieldError = errors[field.name];

            return (
              <motion.div
                key={field.name}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]"
                >
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldError)}
                    aria-describedby={
                      fieldError ? `${field.name}-error` : undefined
                    }
                    className={cn(
                      "h-12 w-full rounded-2xl border bg-[#FFF8F9] px-4 text-sm font-semibold text-[#374151] outline-none transition-colors focus:border-[#F43F4E] focus:ring-2 focus:ring-[#F43F4E]/20",
                      fieldError ? "border-[#C51624]" : "border-[#FAD7DD]",
                      !values[field.name] && "text-[#9CA3AF]",
                    )}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={field.min}
                    max={field.max}
                    inputMode={field.inputMode}
                    value={values[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldError)}
                    aria-describedby={
                      fieldError ? `${field.name}-error` : undefined
                    }
                    className={cn(
                      "h-12 w-full rounded-2xl border bg-[#FFF8F9] px-4 text-sm font-semibold text-[#374151] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#F43F4E] focus:ring-2 focus:ring-[#F43F4E]/20",
                      fieldError ? "border-[#C51624]" : "border-[#FAD7DD]",
                    )}
                  />
                )}

                {fieldError ? (
                  <p
                    id={`${field.name}-error`}
                    className="mt-2 text-xs font-semibold text-[#C51624]"
                  >
                    {fieldError}
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onReset}
          >
            {resetLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
