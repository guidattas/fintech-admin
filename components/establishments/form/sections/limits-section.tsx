"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { LIMIT_CATALOG } from "@/lib/constants/establishment";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function LimitsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  return (
    <SectionCard
      title="Limites"
      description="Tetos de operação por canal e por dia (em reais)."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {LIMIT_CATALOG.map((entry, index) => {
          const fieldError = errors.limits?.[index]?.value?.message;
          return (
            <FormField
              key={entry.key}
              label={entry.label}
              htmlFor={`limit-${entry.key}`}
              required
              error={fieldError}
              hint={entry.helper}
            >
              <input
                type="hidden"
                value={entry.key}
                {...register(`limits.${index}.key` as const)}
              />
              <Input
                id={`limit-${entry.key}`}
                type="number"
                min={0}
                step="0.01"
                invalid={Boolean(fieldError)}
                {...register(`limits.${index}.value` as const)}
              />
            </FormField>
          );
        })}
      </div>
    </SectionCard>
  );
}
